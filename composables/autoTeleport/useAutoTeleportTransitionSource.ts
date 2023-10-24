import {
  type Chain,
  chainToPrefixMap,
  getChainCurrency,
  allowedTransitions as teleportRoutes,
} from '@/utils/teleport'
import { maxBy, toPairs } from 'lodash'
import { Actions } from '@/composables/transaction/types'
import { chainPropListOf } from '@/utils/config/chain.config'

const BUFFER_AMOUNT_PERCENT = 0.005

export default function (action: Actions, neededAmount: ComputedRef<number>) {
  const {
    chainBalances,
    chain: currentChain,
    fetchChainsBalances,
    getAddressByChain,
  } = useTeleport()

  const teleportTxFee = ref(0)
  // const actionTxFee = ref(0)

  const chainSymbol = computed(
    () => currentChain.value && getChainCurrency(currentChain.value),
  )

  const targetChains = computed(() =>
    currentChain.value ? teleportRoutes[currentChain.value] : [],
  )

  const currentChainBalance = computed(
    () => currentChain.value && Number(chainBalances[currentChain.value]()),
  )

  const hasEnoughInCurrentChain = computed(
    () => neededAmount.value <= Number(currentChainBalance.value),
  )

  const sourceChainsBalances = computed<{ [key: Chain]: string }>(() =>
    targetChains.value.reduce(
      (reducer, chainPrefix) => ({
        ...reducer,
        [chainPrefix]: chainBalances[chainPrefix](),
      }),
      {},
    ),
  )

  const richestChain = computed<Chain | undefined>(() =>
    maxBy(toPairs(sourceChainsBalances.value, (pair) => Number(pair[1]))[0]),
  )
  const richestChainBalance = computed(() =>
    richestChain.value
      ? Number(sourceChainsBalances.value[richestChain.value])
      : 0,
  )

  const fees = computed(() => teleportTxFee.value)

  const buffer = computed(() => {
    if (fees.value === 0) {
      return neededAmount.value * BUFFER_AMOUNT_PERCENT
    }
    return fees.value
  })

  const amountToTeleport = computed(
    () => neededAmount.value + buffer.value - Number(currentChainBalance.value),
  )

  const hasEnoughInRichestChain = computed(
    () => (richestChainBalance.value || 0) >= amountToTeleport.value,
  )

  const addTeleportFee = computed(() => {
    const sourceChainProperties = chainPropListOf(
      chainToPrefixMap[richestChain.value],
    )
    return sourceChainProperties?.tokenSymbol === chainSymbol.value
  })

  const getTeleportTransactionFee = async () => {
    if (!hasEnoughInRichestChain.value && amountToTeleport.value) {
      return
    }

    return await getTransactionFee({
      amount: amountToTeleport.value,
      from: richestChain.value as Chain,
      fromAddress: getAddressByChain(richestChain.value as Chain),
      to: currentChain.value as Chain,
      toAddress: getAddressByChain(currentChain.value as Chain),
      currency: chainSymbol.value as string,
    })
  }

  watchSyncEffect(async () => {
    if (richestChain.value && !teleportTxFee.value && addTeleportFee.value) {
      const fee = await getTeleportTransactionFee()
      teleportTxFee.value = Number(fee || 0)
    }
  })

  watch(
    targetChains,
    async () => {
      if (targetChains.value.length) {
        await fetchChainsBalances([
          ...targetChains.value,
          currentChain.value as Chain,
        ])
      }
    },
    { immediate: true },
  )

  return {
    amountToTeleport,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    sourceChain: richestChain,
    chainSymbol,
  }
}
