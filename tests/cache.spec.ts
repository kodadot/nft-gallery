/**
 * @jest-environment jsdom
 */

import { getCloudflareImageLinks } from '@/utils/cachingStrategy'
import { fastExtract } from '~/utils/ipfs'
import { getMany } from 'idb-keyval'
import { imageStore } from '~/utils/idbStore'
import { queryBatch, querySingle } from '@/utils/cloudflare'
import { zip } from '~/components/rmrk/utils'

describe('CACHE TEST', (): void => {
  let extracted: string[]

  beforeAll(async () => {
    extracted = [
      'bafkreidfhjmgvpega2fk4papiu2ftgdieqyquypfahursrtz5r645p6coe',
      'bafkreidrlzhgmohrmsavgzdqfbaxejkvpbbph4cdyqfyxso4jz52czgvgm',
      'bafkreiajcsjmvpvglxrkpa6h3jruzintytdik7f2hb64lxduyaqlr4l5um',
      'bafkreie6ha2kq4ira22zsrkw6zyixjyjwukrcvqklevsrtj6dpu5fex7nm',
    ]
  })

  // it('can correctlyBuild a cache map', async () => {
  //   const urls = await getCloudflareImageLinks(ipfsUrlList)
  //   const extracted = fastExtract(ipfsUrlList[0])
  //   console.log(urls)
  //   expect(urls[extracted]).toBeDefined()
  // })

  // it('get data from idb', async () => {
  //   const extracted = fastExtract(ipfsUrlList[0])
  //   const urls = await getMany([extracted], imageStore).catch(console.error)
  //   expect(urls).toBeDefined()
  // })

  it('get batch data from durable object', async () => {
    const urls = await queryBatch(extracted).catch(console.error)
    expect(urls).toBeDefined()
    expect(
      urls['bafkreihzmxiskshktzd4truqonjbnsxtiylp4wjcsjonoqqe6wcwfqrdgm']
    ).toBeDefined()
    expect(
      urls['bafkreic425oyw2c5sucxm7ererl4s3v2ehfrkkhfwhyxfq4cbon4amjwqi']
    ).toBeDefined()
  })

  it('get single data from durable object', async () => {
    const urls = await querySingle(extracted[0]).catch(console.error)
    expect(urls).toBeDefined()
    expect(
      urls['bafkreihzmxiskshktzd4truqonjbnsxtiylp4wjcsjonoqqe6wcwfqrdgm']
    ).toBeDefined()
  })

  it.only('can zip correctly', async () => {
    const cache = [undefined, '5a3a69c3-dad2-4cd2-38af-6cb48ace2b00', '6ad86b0d-1e57-4db8-8061-98cdeb9e9e00', undefined]
    const zipped = zip(extracted, cache)
    expect(zipped).toBeDefined()
    expect(zipped.length).toBe(4)
    expect(zipped[0]).toBeInstanceOf(Array)
    expect(zipped[0]).toStrictEqual([extracted[0], cache[0]])
    expect(zipped[1]).toBeInstanceOf(Array)
    expect(zipped[1]).toStrictEqual([extracted[1], cache[1]])
  })
})
