import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import {onlyEvents, onlyPriceEvents, collectionFloorPriceList} from '@/components/rmrk/utils'
import { expect } from 'chai'
import { fullCollection } from './sample2'

describe('FLOOR PRICE TEST', (): void => {
  let nfts: NFT[] = []


  before(() => {
    nfts = fullCollection.data.collectionEntity.nfts.nodes as unknown as NFT[]
  })

  it('can get floor price from events', () => {

    const floorPrice : number = Math.min(
      ...nfts.map((nft: NFT) => Number(nft.price)).filter((price: number) => price > 0)
    )

    const now = new Date().toString()

    const priceEvents: Interaction[][] = nfts
      .map(onlyEvents)
      .map(evts => evts.filter(onlyPriceEvents))

    const floorPriceListFn = collectionFloorPriceList(priceEvents, 12)
    const floorPriceFromEvents = floorPriceListFn(now)

    expect(floorPrice).to.equal(floorPriceFromEvents[1] * 10 ** 12)
  })
})
