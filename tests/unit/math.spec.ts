import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import formatBalance from '@/utils/formatBalance'
import { expect } from 'chai'
import { fullCollection } from './sample2'

describe('MATHEMATICS TEST', (): void => {
  let nfts: NFT[]


  before(async () => {
    nfts = fullCollection.data.collectionEntity.nfts.nodes as unknown as NFT[]
  })

  it('can correctly match sales', async () => {
    const value: bigint = nfts
      .map(nft => nft.events)
      .map(events => {

        const res: Interaction[] = []
        events?.forEach((event, index) => {
          if (event.interaction === 'BUY' && index >= 1 && events[index -1].interaction === 'LIST') {
            res.push(events[index -1])
          }
        })
        return res
      })
      .flatMap(x => x)
      .map(x => x.meta)
      .map(x => BigInt(x || 0))
      .reduce((acc, cur) => acc + cur, BigInt(0))

    const result = formatBalance(value, 12, true)
    const eq = '0.5056 Unit'
    expect(result).to.equal(eq)
  })
})
