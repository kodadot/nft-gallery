import {
  type Chain,
  chainToPrefixMap,
  getChainCurrency,
  allowedTransitions as teleportRoutes,
} from '@/utils/teleport'
import { chainPropListOf } from '@/utils/config/chain.config'
import { getMaxKeyByValue } from '@/utils/math'
import { getActionTransactionFee } from '@/utils/transactionExecutor'
import sum from 'lodash/sum'
import type { AutoTeleportAction, AutoTeleportFeeParams } from './types'

const BUFFER_FEE_PERCENT = 0.2
const BUFFER_AMOUNT_PERCENT = 0.02

export default function (
  actions: ComputedRef<AutoTeleportAction[]>,
  neededAmount: ComputedRef<number>,
  fees: AutoTeleportFeeParams = { actionAutoFees: true, actions: 0 },
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
  const actionTxFees = ref<number[]>([])
  const extraActionFees = computed(() =>
    fees.actions ? Math.ceil(fees.actions) : 0,
  )
  const actionAutoFees = computed(() => fees.actionAutoFees || true)

  const chainSymbol = computed(
    () => currentChain.value && getChainCurrency(currentChain.value),
  )

  const allowedSourceChains = computed(() =>
    currentChain.value ? teleportRoutes[currentChain.value] : [],
  )

  const totalFees = computed(
    () => teleportTxFee.value + sum(actionTxFees.value) + extraActionFees.value,
  )

  const neededAmountWithFees = computed(
    () => Math.ceil(neededAmount.value) + totalFees.value,
  )

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

  const richestChain = computed<Chain | undefined>(
    () => getMaxKeyByValue(sourceChainsBalances.value) as Chain | undefined,
  )

  const richestChainBalance = computed(() =>
    richestChain.value
      ? Number(sourceChainsBalances.value[richestChain.value])
      : 0,
  )

  const buffer = computed(() => {
    const bufferFee = Math.ceil(totalFees.value * BUFFER_FEE_PERCENT)
    const amountFee = Math.ceil(
      neededAmountWithFees.value * BUFFER_AMOUNT_PERCENT,
    )
    return bufferFee === 0 ? amountFee : bufferFee
  })

  const amountToTeleport = computed(
    () =>
      neededAmountWithFees.value +
      buffer.value -
      transferableCurrentChainBalance.value,
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
      amountToTeleport.value > 0,
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
      if (actionAutoFees.value) {
        try {
          const feesPromisses = actions.value.map(
            async ({ action, prefix }) => {
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
            },
          )
          const fees = await Promise.all(feesPromisses)
          actionTxFees.value = fees.map(Number)
        } catch (error) {
          console.error(`[AUTOTELEPORT]: Failed getting action fee  ${error}`)
        }
      }
    },
    { immediate: true },
  )

  watch(
    [allowedSourceChains, hasEnoughInCurrentChain],
    async () => {
      if (allowedSourceChains.value.length && !hasEnoughInCurrentChain.value) {
        await getTransitionBalances()
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
