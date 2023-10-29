import {
  type Chain,
  chainToPrefixMap,
  getChainCurrency,
  allowedTransitions as teleportRoutes,
} from '@/utils/teleport'
import { chainPropListOf } from '@/utils/config/chain.config'
import { getMaxKeyByValue } from '@/utils/math'
import { executeAction } from '@/composables/useTransaction'
import { Actions } from '../transaction/types'

const BUFFER_AMOUNT_PERCENT = 0.005

export default function (
  action: ComputedRef<Actions>,
  neededAmount: ComputedRef<number>,
) {
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
      teleportTxFee.value = Number(fee) || 0
    }
  })

  const getActionTransactionFee = () => {
    return new Promise(async (resolve, reject) => {
      const api = await apiInstance.value
      const address = getAddressByChain(currentChain.value as Chain)

      executeAction({
        api,
        item: action.value,
        executeTransaction: async ({ cb, arg }) => {
          try {
            const fee = await estimate(address, cb, arg)
            resolve(fee)
          } catch (error) {
            reject(error)
          }
        },
        isLoading: ref(false),
        status: '',
      })
    })
  }

  watch(
    action,
    async () => {
      const fee = await getActionTransactionFee()
      actionTxFee.value = Number(fee)
    },
    { immediate: true },
  )

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
