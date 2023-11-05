import {
  type Chain,
  type TeleportChain,
  type TeleportTransition,
  chainToPrefixMap,
  prefixToChainMap,
} from '@/utils/teleport'
import useAutoTeleportTransitionDetails from '~/composables/autoTeleport/useAutoTeleportTransitionDetails'
import { AutoTeleportAction } from './types'

export default function ({
  actions,
  neededAmount,
  teleportStatus,
  feelss = false,
}: {
  actions: ComputedRef<AutoTeleportAction[]>
  neededAmount: ComputedRef<number>
  teleportStatus: Ref<string>
  feelss: boolean
}) {
  const { urlPrefix } = usePrefix()
  const { isAvailable, getChainTokenDecimals } = useTeleport()

  const {
    amountToTeleport,
    hasBalances,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    sourceChain,
    chainSymbol,
  } = useAutoTeleportTransitionDetails(actions, neededAmount, feelss)

  const { formatted: amountFormatted, usd: amountUsd } = useAmount(
    amountToTeleport,
    computed(() => Number(getChainTokenDecimals(sourceChain.value as Chain))),
    chainSymbol as ComputedRef<string>,
  )

  const optimalTransition = ref<TeleportTransition>(
    emptyObject<TeleportTransition>(),
  )

  watchSyncEffect(() => {
    if (teleportStatus.value === TransactionStatus.Finalized) {
      return
    }

    let source: TeleportChain | null = null

    if (hasEnoughInRichestChain.value && sourceChain.value) {
      source = {
        chain: sourceChain.value,
        prefix: chainToPrefixMap[sourceChain.value],
        name: getChainName(chainToPrefixMap[sourceChain.value]),
      }
    }

    optimalTransition.value = {
      source: source,
      destination: {
        chain: prefixToChainMap[urlPrefix.value] as Chain,
        prefix: urlPrefix.value,
        name: getChainName(urlPrefix.value),
      },
      amount: amountToTeleport.value,
      amountFormatted: amountFormatted.value,
      amountUsd: amountUsd.value,
      token: chainSymbol.value as string,
    }
  })

  return {
    isAvailable,
    hasBalances,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
  }
}
