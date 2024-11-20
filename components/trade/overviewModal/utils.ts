import type { OverviewMode } from '@/components/trade/OfferOverviewModal.vue'

export const useIsTradeOverview = (trade: ComputedRef<TradeNftItem | undefined>) => {
  const { accountId } = useAuth()
  const { isOwnerOfNft } = useIsTrade(trade, accountId)

  const mode = computed<OverviewMode>(() => isOwnerOfNft.value ? 'incoming' : 'owner')

  const isMyTrade = computed(() => mode.value === 'owner')
  const isIncomingTrade = computed(() => mode.value === 'incoming')

  return {
    isMyTrade,
    isIncomingTrade,
    mode,
  }
}
