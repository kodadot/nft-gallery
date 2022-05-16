export const enum HistoryEventType {
  MINTNFT = 'MINTNFT',
  LIST = 'LIST',
  BUY = 'BUY',
  SEND = 'SEND',
  CONSUME = 'CONSUME',
  UNLIST = 'UNLIST',
  ALL = 'ALL',
}

export const EventToIconMap = {
  [HistoryEventType.MINTNFT]: '🖼',
  [HistoryEventType.LIST]: '📰',
  [HistoryEventType.UNLIST]: '🗞',
  [HistoryEventType.SEND]: '🎁',
  [HistoryEventType.CONSUME]: '🔥',
  [HistoryEventType.BUY]: '🤝',
}

export const wrapEventNameWithIcon = (
  type: HistoryEventType,
  eventName: string
) => `${EventToIconMap[type]} ${eventName}`
