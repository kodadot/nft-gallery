import {
  type Chain,
  chainToPrefixMap,
  getChainCurrency,
  allowedTransitions as teleportRoutes,
} from '@/utils/teleport'
import { chainPropListOf } from '@/utils/config/chain.config'
import { getMaxKeyByValue } from '@/utils/math'
import { getActionTransactionFee } from '@/utils/transactionExecutor'
import { AutoTeleportAction } from './useAutoTeleport'

const BUFFER_FEE_PERCENT = 0.2

export default function (
  actions: ComputedRef<AutoTeleportAction[]>,
  neededAmount: ComputedRef<number>,
) {
  const {
    chainBalances,
    chain: currentChain,
    fetchChainsBalances,
    getAddressByChain,
  } = useTeleport()
  const { apiInstance, apiInstanceByPrefix } = useApi()
  const { balance } = useBalance()

  const hasBalances = ref(false)
  const teleportTxFee = ref(0)
  const actionTxFees = ref([])

  const chainSymbol = computed(
    () => currentChain.value && getChainCurrency(currentChain.value),
  )

  const allowedSourceChains = computed(() =>
    currentChain.value ? teleportRoutes[currentChain.value] : [],
  )

  const fees = computed(
    () =>
      teleportTxFee.value + actionTxFees.value.reduce((r, num) => r + num, 0),
  )

  const neededAmountWithFees = computed(() => neededAmount.value + fees.value)

  const currentChainBalance = computed(
    () =>
      (currentChain.value && Number(chainBalances[currentChain.value]())) ||
      Number(balance.value),
  )

  const { existentialDeposit } = useDeposit(
    computed(() => chainToPrefixMap[currentChain.value]),
  )

  const transferableCurrentChainBalance = computed(
    () => Number(currentChainBalance.value) - existentialDeposit.value,
  )

  const hasEnoughInCurrentChain = computed(
    () =>
      neededAmountWithFees.value <=
      Number(transferableCurrentChainBalance.value),
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

  const buffer = computed(() => Math.ceil(fees.value * BUFFER_FEE_PERCENT))

  const amountToTeleport = computed(
    () =>
      neededAmountWithFees.value +
      buffer.value -
      transferableCurrentChainBalance.value,
  )

  const hasEnoughInRichestChain = computed(
    () => (richestChainBalance.value || 0) >= amountToTeleport.value,
  )

  const hasTransitionBalances = computed(() => {
    const hasSourceChainsBalances = Object.values(
      sourceChainsBalances.value,
    ).every(Boolean)
    return hasSourceChainsBalances && Boolean(currentChainBalance.value)
  })

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

  const getTransitionBalances = () => {
    return fetchChainsBalances([
      ...allowedSourceChains.value,
      currentChain.value as Chain,
    ])
  }

  watch(fetchTeleportFee, async () => {
    if (fetchTeleportFee.value) {
      const fee = await getTeleportTransactionFee()
      teleportTxFee.value = Number(fee) || 0
    }
  })

  watch(
    actions,
    async () => {
      const feesPromisses = actions.value.map(async ({ action, prefix }) => {
        let api = await apiInstance.value

        if (prefix) {
          api = await apiInstanceByPrefix(prefix)
        }

        const address = getAddressByChain(currentChain.value as Chain)
        return getActionTransactionFee({
          api,
          action: action,
          address,
        })
      })

      const fees = await Promise.all(feesPromisses)

      actionTxFees.value = fees.map(Number)
    },
    { immediate: true },
  )

  watch(
    [allowedSourceChains, hasEnoughInCurrentChain, hasTransitionBalances],
    async () => {
      if (
        allowedSourceChains.value.length &&
        !hasEnoughInCurrentChain.value &&
        !hasTransitionBalances.value
      ) {
        await getTransitionBalances()
        hasBalances.value = true
      } else {
        hasBalances.value = hasTransitionBalances.value
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
