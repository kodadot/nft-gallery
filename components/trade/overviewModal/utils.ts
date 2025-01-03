import type { Prefix } from '@kodadot1/static'

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

export type ExecTxParams = {
  trade: TradeNftItem
  sendItem?: string
  transaction: ReturnType<typeof useTransaction>['transaction']
  urlPrefix: Prefix
}

export const TradeTypeTx: Record<TradeType, Record<OverviewMode, (params: ExecTxParams) => void>> = {
  [TradeType.SWAP]: {
    owner: ({ trade, urlPrefix, transaction }) => {
      transaction({
        interaction: ShoppingActions.CANCEL_SWAP,
        urlPrefix: urlPrefix,
        offeredId: trade.offered.sn,
        offeredCollectionId: trade.offered.collection.id,
      })
    },
    incoming: ({ trade, sendItem, urlPrefix, transaction }) => {
      transaction({
        interaction: ShoppingActions.ACCEPT_SWAP,
        urlPrefix: urlPrefix,
        receiveItem: trade.offered.sn,
        receiveCollection: trade.offered.collection.id,
        sendCollection: trade.considered.id,
        sendItem: sendItem,
        price: trade.price,
        surcharge: (trade as TradeNftItem<Swap>).surcharge,
      })
    },
  },
  [TradeType.OFFER]: {
    owner: ({ trade, transaction, urlPrefix }) => {
      transaction({
        interaction: ShoppingActions.CANCEL_OFFER,
        urlPrefix: urlPrefix,
        offeredId: trade.offered.sn,
      })
    },
    incoming: ({ trade, sendItem, transaction, urlPrefix }) => {
      transaction({
        interaction: ShoppingActions.ACCEPT_OFFER,
        urlPrefix: urlPrefix,
        receiveItem: trade.offered.sn,
        sendCollection: trade.considered.id,
        sendItem: sendItem,
        price: trade.price,
      })
    },
  },
}
