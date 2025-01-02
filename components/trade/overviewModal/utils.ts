export type OverviewMode = 'owner' | 'incoming'

export const useIsTradeOverview = (trade: ComputedRef<TradeNftItem | undefined>) => {
  const { accountId } = useAuth()
  const { isTargetOfTrade } = useIsTrade(trade, accountId)

  const mode = computed<OverviewMode>(() => isTargetOfTrade.value ? 'incoming' : 'owner')

  const isMyTrade = computed(() => mode.value === 'owner')
  const isIncomingTrade = computed(() => mode.value === 'incoming')

  return {
    isMyTrade,
    isIncomingTrade,
    mode,
  }
}
