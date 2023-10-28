import {
  type Chain,
  chainToPrefixMap,
  getChainCurrency,
  allowedTransitions as teleportRoutes,
} from '@/utils/teleport'
import { chainPropListOf } from '@/utils/config/chain.config'
import { getMaxKeyByValue } from '@/utils/math'

const BUFFER_AMOUNT_PERCENT = 0.005
const ACTION_TRANSACTION_FEE_MULTIPLIER = 3

export default function (neededAmount: ComputedRef<number>) {
  const {
    chainBalances,
    chain: currentChain,
    fetchChainsBalances,
    getAddressByChain,
  } = useTeleport()
  const { apiInstance } = useApi()
  const { balance } = useBalance()

  const hasBalances = ref(false)
  const teleportTxFee = ref(0)
  const actionTxFee = ref(0)

  const chainSymbol = computed(
    () => currentChain.value && getChainCurrency(currentChain.value),
  )

  const allowedSourceChains = computed(() =>
    currentChain.value ? teleportRoutes[currentChain.value] : [],
  )

  const currentChainBalance = computed(
    () =>
      (currentChain.value && Number(chainBalances[currentChain.value]())) ||
      Number(balance.value),
  )

  const hasEnoughInCurrentChain = computed(
    () => neededAmount.value <= Number(currentChainBalance.value),
  )

  const sourceChainsBalances = computed<{ [key: Chain]: string }>(() =>
    allowedSourceChains.value.reduce(
      (reducer, chainPrefix) => ({
        ...reducer,
        [chainPrefix]: chainBalances[chainPrefix](),
      }),
      {},
    ),
  )

  const richestChain = computed<Chain | undefined>(() =>
    getMaxKeyByValue(sourceChainsBalances.value),
  )

  const richestChainBalance = computed(() =>
    richestChain.value
      ? Number(sourceChainsBalances.value[richestChain.value])
      : 0,
  )

  const fees = computed(() => teleportTxFee.value + actionTxFee.value)

  const buffer = computed(() =>
    fees.value === 0 ? neededAmount.value * BUFFER_AMOUNT_PERCENT : fees.value,
  )

  const amountToTeleport = computed(
    () => neededAmount.value + buffer.value - Number(currentChainBalance.value),
  )

  const hasEnoughInRichestChain = computed(
    () => (richestChainBalance.value || 0) >= amountToTeleport.value,
  )

  const addTeleportFee = computed(() => {
    if (!richestChain.value) {
      return false
    }

    const sourceChainProperties = chainPropListOf(
      chainToPrefixMap[richestChain.value],
    )
    return sourceChainProperties?.tokenSymbol === chainSymbol.value
  })

  const getTeleportTransactionFee = async () => {
    return await getTransactionFee({
      amount: amountToTeleport.value,
      from: richestChain.value as Chain,
      fromAddress: getAddressByChain(richestChain.value as Chain),
      to: currentChain.value as Chain,
      toAddress: getAddressByChain(currentChain.value as Chain),
      currency: chainSymbol.value as string,
    })
  }

  const fetchTeleportFee = computed(
    () =>
      richestChain.value &&
      !teleportTxFee.value &&
      addTeleportFee.value &&
      hasEnoughInRichestChain.value &&
      amountToTeleport.value,
  )

  watch(fetchTeleportFee, async () => {
    if (fetchTeleportFee.value) {
      const fee = await getTeleportTransactionFee()
      teleportTxFee.value = Number(fee || 0)
    }
  })

  const getDummyChainTransactionFee = async () => {
    const address = getAddressByChain(currentChain.value as Chain)

    const api = await apiInstance.value

    const cb = api.tx.balances.transfer

    return estimate(address, cb, [address, 1000000000])
  }

  watchSyncEffect(async () => {
    const fee = await getDummyChainTransactionFee()
    actionTxFee.value = Number(fee) * ACTION_TRANSACTION_FEE_MULTIPLIER
  })

  watch(
    [allowedSourceChains, hasEnoughInCurrentChain],
    async () => {
      if (allowedSourceChains.value.length && !hasEnoughInCurrentChain.value) {
        await fetchChainsBalances([
          ...allowedSourceChains.value,
          currentChain.value as Chain,
        ])
        hasBalances.value = true
      }
    },
    { immediate: true },
  )

  return {
    amountToTeleport,
    hasBalances,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    sourceChain: richestChain,
    chainSymbol,
  }
}
