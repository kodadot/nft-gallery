import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import { isBefore, isEqual, parseISO } from 'date-fns'
import { expect } from 'chai'
import { fullCollection } from './sample2'

describe('FLOOR PRICE TEST', (): void => {
  let nfts: NFT[] = []


  before(async () => {
    nfts = fullCollection.data.collectionEntity.nfts.nodes as unknown as NFT[]
  })

  it('can get floor price from events', () => {

    const floorPrice : number = Math.min(
      ...nfts.map((nft: NFT) => Number(nft.price)).filter((price: number) => price > 0)
    )

    const now = new Date()

    const priceEvents: Interaction[] = nfts
      .map(nft => nft.events)
      .map(evts => evts.filter(e => e.interaction === 'LIST' || e.interaction === 'BUY' || e.interaction === 'SEND' || e.interaction === 'CONSUME'))
      .map(evts => {
        const beforeEvts = evts.filter(e => isBefore(parseISO(e.timestamp), now) || isEqual(parseISO(e.timestamp), now))
        return beforeEvts.length && beforeEvts[beforeEvts.length - 1].interaction === 'LIST' ? [beforeEvts[beforeEvts.length - 1]] : []
      })
      .flat()

    const floorPriceFromEvents : number = Math.min(...priceEvents.map(e => Number(e.meta)).filter(price => price > 0))

    expect(floorPrice).to.equal(floorPriceFromEvents)
  })
})
