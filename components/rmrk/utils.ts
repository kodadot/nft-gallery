import { MediaType, RMRK } from './types'
import { Interaction as EventInteraction } from './service/scheme'
import { NFT, NFTWithMeta } from './service/scheme'
import { before } from '@/utils/math'
import { Interaction } from '@kodadot1/minimark'

export type PriceDataType = [date: Date, value: number]

export const zip = <T1, T2, T3>(
  a: T1[],
  b: T2[],
  cb?: (el: [T1, T2]) => T3
): T3[] | [T1, T2][] => {
  const res: [T1, T2][] = a.map((k, i) => [k, b[i]])

  if (cb) {
    return res.map(cb)
  }

  return res
}

export function mapPriceToNumber(instances: NFTWithMeta[]): any[] {
  return instances.map((i) => ({ ...i, price: Number(i.price || 0) }))
}

export const isEmpty = (rmrk: RMRK): boolean => {
  return !rmrk.event
}

export const equals = (first: RMRK, second: RMRK): boolean => {
  if (first.event !== second.event) {
    return false
  }

  return true
}

export const resolveMedia = (mimeType?: string): MediaType => {
  if (!mimeType) {
    return MediaType.UNKNOWN
  }

  if (/^application\/json/.test(mimeType)) {
    return MediaType.MODEL
  }

  if (/^text\/html/.test(mimeType)) {
    return MediaType.IFRAME
  }

  if (/^image\/svg\+xml/.test(mimeType)) {
    return MediaType.IMAGE
  }

  if (/^application\/pdf/.test(mimeType)) {
    return MediaType.OBJECT
  }

  const match = mimeType.match(/^[a-z]+/)

  if (!match) {
    return MediaType.UNKNOWN
  }

  const prefix = match[0].toUpperCase()

  let result = MediaType.UNKNOWN

  Object.entries(MediaType).forEach(([type, value]) => {
    if (type === prefix) {
      result = value
      return
    }
  })

  return result
}

export const onlyEvents = (nft: NFT): EventInteraction[] => nft.events
export const onlyPriceEvents = (e: { interaction: string }): boolean =>
  e.interaction !== 'MINTNFT'
export const eventsBeforeTime =
  (time: string) =>
  (evts: EventInteraction[]): EventInteraction[] => {
    const res = evts.filter(before(new Date(time)))
    return res.length && res[res.length - 1].interaction === 'LIST'
      ? [res[res.length - 1]]
      : []
  }
export const collectionFloorPriceList =
  (priceEvents: EventInteraction[][], decimals: number) =>
  (time: string): PriceDataType => {
    const listEventsBeforeTime = priceEvents.map(eventsBeforeTime(time)).flat()
    const priceEvent = listEventsBeforeTime
      .map((e: EventInteraction) => Number(e.meta) / 10 ** decimals)
      .filter((price: number) => price > 0)

    const floorPrice = priceEvent.length ? Math.min(...priceEvent) : 0
    return [new Date(time), floorPrice]
  }
export const onlyBuyEvents = (
  nftEvents: EventInteraction[]
): EventInteraction[] => {
  const buyEvents: EventInteraction[] = []
  nftEvents?.forEach((e: EventInteraction, index: number) => {
    if (
      e.interaction === Interaction.BUY &&
      index >= 1 &&
      nftEvents[index - 1].interaction === Interaction.LIST
    ) {
      buyEvents.push({ ...e, meta: nftEvents[index - 1].meta })
    }
  })
  return buyEvents
}

export const getRandomIntInRange = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getNameOfNft = (nft: NFT): string => {
  return nft.name || `${nft.collection.name} - #${nft.sn}`
}
