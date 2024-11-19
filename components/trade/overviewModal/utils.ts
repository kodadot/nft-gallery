import type { OverviewMode } from '@/components/trade/OfferOverviewModal.vue'

export const useIsTradeOverview = (trade) => {
  const { accountId } = useAuth()
  const { isOwnerOfNft } = useIsTrade(computed(() => trade), accountId)

  const mode = computed<OverviewMode>(() => isOwnerOfNft.value ? 'incoming' : 'owner')

  const isMyTrade = computed(() => mode.value === 'owner')
  const isIncomingTrade = computed(() => mode.value === 'incoming')

  return {
    isMyTrade,
    isIncomingTrade,
    mode,
  }
}
