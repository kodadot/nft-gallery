import sum from 'lodash/sum'
import type { Prefix } from '@kodadot1/static'
import { existentialDeposit } from '@kodadot1/static'
import type { Actions } from '../transaction/types'
import type { AutoTeleportAction, AutoTeleportFeeParams } from './types'
import {
  checkIfAutoTeleportActionsNeedRefetch,
  getChainExistentialDeposit,
} from './utils'
import {
  type Chain,
  chainToPrefixMap,
  getChainCurrency,
  allowedTransitions as teleportRoutes,
} from '@/utils/teleport'
import { chainPropListOf } from '@/utils/config/chain.config'
import { getMaxKeyByValue } from '@/utils/math'
import { getActionTransactionFee } from '@/utils/transactionExecutor'

export const BUFFER_FEE_PERCENT = 0.1

const DEFAULT_AUTO_TELEPORT_FEE_PARAMS = {
  actionAutoFees: true,
  actions: 0,
  forceActionAutoFees: false,
}

export default function (
  actions: ComputedRef<AutoTeleportAction[]>,
  neededAmount: ComputedRef<number | bigint>,
  feesParams: AutoTeleportFeeParams = DEFAULT_AUTO_TELEPORT_FEE_PARAMS,
) {
  const {
    chainBalances,
    chain: currentChain,
    fetchChainsBalances,
    getAddressByChain,
  } = useTeleport()
  const fees = { ...DEFAULT_AUTO_TELEPORT_FEE_PARAMS, ...feesParams }

  const { balance } = useBalance()

  const hasFetched = reactive({
    teleportTxFee: false,
    actionTxFees: false,
    balances: false,
  })

  const shouldTeleportAllBalance = ref(false)
  const teleportTxFee = ref(0)
  const actionTxFees = ref<number[]>([])
  const extraActionFees = computed(() =>
    fees.actions ? Math.ceil(fees.actions) : 0,
  )

  const chainSymbol = computed(
    () => currentChain.value && getChainCurrency(currentChain.value),
  )

  const allowedSourceChains = computed(() =>
    currentChain.value ? teleportRoutes[currentChain.value] ?? [] : [],
  )

  const totalFees = computed(
    () => teleportTxFee.value + sum(actionTxFees.value) + extraActionFees.value,
  )

  const neededAmountWithFees = computed(
    () => Math.ceil(Number(neededAmount.value)) + totalFees.value,
  )

  const currentChainBalance = computed(
    () =>
      (currentChain.value && Number(chainBalances.value[currentChain.value]))
      || Number(balance.value),
  )

  const currentChainExistentialDeposit = computed(() =>
    currentChain.value
      ? existentialDeposit[chainToPrefixMap[currentChain.value]] ?? 0
      : 0,
  )

  const transferableCurrentChainBalance = computed(
    () =>
      Number(currentChainBalance.value) - currentChainExistentialDeposit.value,
  )

  const hasEnoughInCurrentChain = computed(
    () =>
      neededAmountWithFees.value
      <= Number(transferableCurrentChainBalance.value),
  )

  const needsSourceChainBalances = computed(
    () => !hasEnoughInCurrentChain.value && !hasSourceChainBalances.value,
  )

  const actionAutoFees = computed(() =>
    fees.actionAutoFees
      ? fees.forceActionAutoFees || !hasEnoughInCurrentChain.value
      : false,
  )

  const sourceChainsBalances = computed<Record<Chain, string>>(() =>
    allowedSourceChains.value.reduce(
      (reducer, chainPrefix) => ({
        ...reducer,
        [chainPrefix]: chainBalances.value[chainPrefix],
      }),
      {},
    ),
  )

  const hasSourceChainBalances = computed(
    () => Object.values(sourceChainsBalances.value).every(Boolean),
  )

  const hasBalances = computed(
    () =>
      (Boolean(currentChainBalance.value) && hasSourceChainBalances.value)
      || hasFetched.balances,
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

  const buffer = computed(() => Math.ceil(totalFees.value * BUFFER_FEE_PERCENT))

  const requiredAmountToTeleport = computed(
    () =>
      neededAmountWithFees.value
      + buffer.value
      - transferableCurrentChainBalance.value,
  )

  const amountToTeleport = computed(() =>
    shouldTeleportAllBalance.value
      ? richestChainBalance.value - (buffer.value + totalFees.value)
      : requiredAmountToTeleport.value,
  )

  // Disabled until delivery fee accounting is fixed by PolkadotJS
  // @see https://github.com/kodadot/nft-gallery/issues/9596#issuecomment-2026772987
  // const shouldTeleportAllBalance = computed<boolean>(() => {
  //   const hasRichesChain = Boolean(richestChain.value)
  //   const doesntHaveEnoughInCurrentChain = !hasEnoughInCurrentChain.value
  //   const willRemainingRichestChainBalanceBeSlashed =
  //     richestChainBalance.value - requiredAmountToTeleport.value <=
  //     richestChainExistentialDeposit.value
  //   const hasRequiredAmountInRichestChain =
  //     richestChainBalance.value >= requiredAmountToTeleport.value

  //   return (
  //     hasRichesChain &&
  //     doesntHaveEnoughInCurrentChain &&
  //     willRemainingRichestChainBalanceBeSlashed &&
  //     hasRequiredAmountInRichestChain
  //   )
  // })

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
      !teleportTxFee.value
      && Boolean(richestChain.value)
      && addTeleportFee.value
      && hasEnoughInRichestChain.value
      && amountToTeleport.value > 0,
  )

  const doesNotNeedsTeleport = computed<boolean>(() => {
    const needsTeleport
      = Boolean(currentChainBalance.value) && !hasEnoughInCurrentChain.value

    if (!needsTeleport) {
      return true
    }

    return Boolean(richestChain.value) && !hasEnoughInRichestChain.value
  })

  const hasFetchedDetails = computed(() => {
    const hasFetchedActionsTxFees = actionAutoFees.value
      ? hasFetched.actionTxFees
      : true

    if (doesNotNeedsTeleport.value) {
      if (fees.forceActionAutoFees) {
        return hasFetchedActionsTxFees
      }
      return true
    }

    return [hasFetched.teleportTxFee, hasFetchedActionsTxFees].every(Boolean)
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
      ...(needsSourceChainBalances.value ? allowedSourceChains.value : []),
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
    [actionsId, actions],
    async ([id, actions], [prevId, prevActions]) => {
      if (
        id !== prevId
        && actionAutoFees.value
        && checkIfAutoTeleportActionsNeedRefetch(actions, prevActions)
      ) {
        try {
          hasFetched.actionTxFees = false
          const address = getAddressByChain(currentChain.value as Chain)
          const feesPromisses = actions.map(async ({ action, prefix }) => {
            return getActionTransactionFee({
              action: action as Actions,
              address,
              prefix: (prefix || (action as Actions).urlPrefix) as Prefix,
            })
          })
          const fees = await Promise.all(feesPromisses)
          actionTxFees.value = fees.map(Number)
        }
        catch (error) {
          console.error(`[AUTOTELEPORT]: Failed getting action fee  ${error}`)
        }
        finally {
          hasFetched.actionTxFees = true
        }
      }
    },
    { immediate: true },
  )

  watch(
    [() => allowedSourceChains.value.length, needsSourceChainBalances],
    async () => {
      if ((allowedSourceChains.value.length && needsSourceChainBalances.value) || !currentChainBalance.value) {
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
