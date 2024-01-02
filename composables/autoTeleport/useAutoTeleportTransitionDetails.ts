import {
  type Chain,
  chainToPrefixMap,
  getChainCurrency,
  getChainExistentialDeposit,
  allowedTransitions as teleportRoutes,
} from '@/utils/teleport'
import { chainPropListOf } from '@/utils/config/chain.config'
import { getMaxKeyByValue } from '@/utils/math'
import { getActionTransactionFee } from '@/utils/transactionExecutor'
import sum from 'lodash/sum'
import type { AutoTeleportAction, AutoTeleportFeeParams } from './types'

const BUFFER_FEE_PERCENT = 0.2
const BUFFER_AMOUNT_PERCENT = 0.02

const DEFAULT_AUTO_TELEPORT_FEE_PARAMS = {
  actionAutoFees: true,
  actions: 0,
  actionLazyFetch: false,
}

export default function (
  actions: ComputedRef<AutoTeleportAction[]>,
  neededAmount: ComputedRef<number>,
  feesParams: AutoTeleportFeeParams = DEFAULT_AUTO_TELEPORT_FEE_PARAMS,
) {
  const {
    chainBalances,
    chain: currentChain,
    fetchChainsBalances,
    getAddressByChain,
  } = useTeleport()
  const fees = { ...DEFAULT_AUTO_TELEPORT_FEE_PARAMS, ...feesParams }

  const { apiInstance, apiInstanceByPrefix } = useApi()
  const { balance } = useBalance()

  const hasFetched = reactive({
    teleportTxFee: false,
    actionTxFees: false,
    balances: false,
  })

  const teleportTxFee = ref(0)
  const actionTxFees = ref<number[]>([])
  const extraActionFees = computed(() =>
    fees.actions ? Math.ceil(fees.actions) : 0,
  )

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

  const currentChainExistentialDeposit = computed(() =>
    getChainExistentialDeposit(currentChain.value),
  )

  const transferableCurrentChainBalance = computed(
    () =>
      Number(currentChainBalance.value) - currentChainExistentialDeposit.value,
  )

  const hasEnoughInCurrentChain = computed(
    () =>
      neededAmountWithFees.value <=
      Number(transferableCurrentChainBalance.value),
  )

  const needsSourceChainBalances = computed(
    () => !hasEnoughInCurrentChain.value,
  )

  const actionAutoFees = computed(() =>
    fees.actionAutoFees
      ? fees.actionLazyFetch || needsSourceChainBalances.value
      : false,
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

  const hasBalances = computed(
    () =>
      (Boolean(currentChainBalance.value) &&
        Object.values(sourceChainsBalances.value).every(Boolean)) ||
      hasFetched.balances,
  )

  const richestChain = computed<Chain | undefined>(
    () => getMaxKeyByValue(sourceChainsBalances.value) as Chain | undefined,
  )

  const richestChainExistentialDeposit = computed(() =>
    getChainExistentialDeposit(richestChain.value),
  )

  const richestChainBalance = computed(() =>
    richestChain.value
      ? Number(sourceChainsBalances.value[richestChain.value])
      : 0,
  )

  const transferableRichestChainBalance = computed(() =>
    Math.max(
      richestChainBalance.value - richestChainExistentialDeposit.value,
      0,
    ),
  )

  const buffer = computed(() => {
    const bufferFee = Math.ceil(totalFees.value * BUFFER_FEE_PERCENT)
    const amountFee = Math.ceil(
      neededAmountWithFees.value * BUFFER_AMOUNT_PERCENT,
    )
    return bufferFee === 0 ? amountFee : bufferFee
  })

  const requiredAmountToTeleport = computed(
    () =>
      neededAmountWithFees.value +
      buffer.value -
      transferableCurrentChainBalance.value,
  )

  const amountToTeleport = computed(() =>
    shouldTeleportAllBalance.value
      ? richestChainBalance.value - (buffer.value + totalFees.value)
      : requiredAmountToTeleport.value,
  )

  const shouldTeleportAllBalance = computed<boolean>(() => {
    const hasRichesChain = Boolean(richestChain.value)
    const doesntHaveEnoughInCurrentChain = !hasEnoughInCurrentChain.value
    const willRemainingRichestChainBalanceBeSlashed =
      richestChainBalance.value - requiredAmountToTeleport.value <=
      richestChainExistentialDeposit.value
    const hasRequiredAmountInRichestChain =
      richestChainBalance.value >= requiredAmountToTeleport.value

    return (
      hasRichesChain &&
      doesntHaveEnoughInCurrentChain &&
      willRemainingRichestChainBalanceBeSlashed &&
      hasRequiredAmountInRichestChain
    )
  })

  const hasEnoughInRichestChain = computed(() => {
    const balance = shouldTeleportAllBalance.value
      ? richestChainBalance.value
      : transferableRichestChainBalance.value

    return balance >= amountToTeleport.value
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

  const canGetTeleportFee = computed<boolean>(
    () =>
      Boolean(richestChain.value) &&
      !teleportTxFee.value &&
      addTeleportFee.value &&
      hasEnoughInRichestChain.value &&
      amountToTeleport.value > 0,
  )

  const doesNotNeedsTeleport = computed<boolean>(() => {
    const needsTeleport =
      Boolean(currentChainBalance.value) && !hasEnoughInCurrentChain.value

    if (!needsTeleport) {
      return true
    }

    return Boolean(richestChain.value) && !hasEnoughInRichestChain.value
  })

  const hasFetchedDetails = computed(() => {
    if (doesNotNeedsTeleport.value) {
      return true
    }

    return [
      hasFetched.teleportTxFee,
      actionAutoFees.value ? hasFetched.actionTxFees : true,
    ].every(Boolean)
  })

  const isReady = computed(() => hasBalances.value && hasFetchedDetails.value)

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

  const getTransitionBalances = () => {
    return fetchChainsBalances([
      ...allowedSourceChains.value,
      currentChain.value as Chain,
    ])
  }

  watch(canGetTeleportFee, async () => {
    if (canGetTeleportFee.value) {
      hasFetched.teleportTxFee = false
      const fee = await getTeleportTransactionFee()
      teleportTxFee.value = Number(fee) || 0
      hasFetched.teleportTxFee = true
    }
  })

  const actionsId = computed(() =>
    actions.value.map(({ action }) => JSON.stringify(action)).join('_'),
  )

  watch(
    actionsId,
    async () => {
      if (actionAutoFees.value) {
        try {
          hasFetched.actionTxFees = false
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
        } finally {
          hasFetched.actionTxFees = true
        }
      }
    },
    { immediate: true },
  )

  watch(
    [allowedSourceChains, needsSourceChainBalances],
    async () => {
      if (allowedSourceChains.value.length && needsSourceChainBalances.value) {
        hasFetched.balances = false
        await getTransitionBalances()
        hasFetched.balances = true
      }
    },
    { immediate: true },
  )

  return {
    amountToTeleport,
    isReady,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    sourceChain: richestChain,
    txFees: totalFees,
    chainSymbol,
  }
}
