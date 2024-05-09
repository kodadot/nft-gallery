import { fastExtract, sanitizeIpfsUrl } from '../../utils/ipfs'
import { kodaImage } from '../../utils/config/ipfs'

it('should return proper url', () => {
  // ipfs path
  let inputUrl =
    'ipfs://ipfs/bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4'
  let output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4'
  let extract = fastExtract(inputUrl)
  expect(extract).toBe(
    'bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4',
  )
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // ipfs another path
  inputUrl =
    'ipfs://bafybeieyaqncocfhn4wx4p3gkan6aljnd4ilwh6h6cvmwr7npik66czg3q/17.json'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeieyaqncocfhn4wx4p3gkan6aljnd4ilwh6h6cvmwr7npik66czg3q/17.json'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(
    'bafybeieyaqncocfhn4wx4p3gkan6aljnd4ilwh6h6cvmwr7npik66czg3q/17.json',
  )
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // ipfs sub path
  inputUrl =
    'ipfs://ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(
    'bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json',
  )
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // ipfs cid
  inputUrl = 'bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(inputUrl)
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // ipfs cid sub path
  inputUrl =
    'bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(inputUrl)
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // ipfs from other gateway
  inputUrl =
    'https://cloudflare-ipfs.com/ipfs/bafkreia3j75r474kgxxmptwh5n43j5nrvn3du5l7dcfq2twh73wmagqs6m'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafkreia3j75r474kgxxmptwh5n43j5nrvn3du5l7dcfq2twh73wmagqs6m'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(inputUrl)
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // ipfs sub path from other gateway
  inputUrl =
    'https://cloudflare-ipfs.com/ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(inputUrl)
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // ipfs from koda gateway
  inputUrl =
    'https://image-beta.w.kodadot.xyz/ipfs/bafkreia3j75r474kgxxmptwh5n43j5nrvn3du5l7dcfq2twh73wmagqs6m'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafkreia3j75r474kgxxmptwh5n43j5nrvn3du5l7dcfq2twh73wmagqs6m'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(inputUrl)
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // external url
  inputUrl =
    'https://polkadot-data.s3.us-east-2.amazonaws.com/metadata/nfts-88/nfts-88_item-5413-meta.json'
  output =
    'https://image-beta.w.kodadot.xyz/type/endpoint/https://polkadot-data.s3.us-east-2.amazonaws.com/metadata/nfts-88/nfts-88_item-5413-meta.json'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(inputUrl)
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // external url from workers
  inputUrl =
    'https://image-beta.w.kodadot.xyz/type/endpoint/https://polkadot-data.s3.us-east-2.amazonaws.com/metadata/nfts-88/nfts-88_item-5413-meta.json'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(inputUrl)
  expect(extract.includes(kodaImage)).toBe(true)
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)

  // external url with html assets
  inputUrl =
    'https://arweave.net/JYh76DBFB1mvvpOS7jrKpOuJG2AFPt1NUp8-5Q9tMUY/index.html?&a=0x3c93690BBe585475FdfADaB3f59b4604008C7ac4&c=8453&tid=1&h=0xebee57cf2600aabca328750397f348b0fcb4e03449863c17c8305c887624ea4e&bh=0xfd6538c8182a8758bb52120ab0ee8820f4d1afc70f4dc1f0b52c9f7ff3e1bf18&bn=3656801&t=1694102949&wa=0x60B824cA6457330f923dd61cf14A011C3421BD6d&ms=1&mi=1&s=120&gp=0&gu=0'
  output =
    'https://image-beta.w.kodadot.xyz/type/endpoint/https://arweave.net/JYh76DBFB1mvvpOS7jrKpOuJG2AFPt1NUp8-5Q9tMUY/index.html?&a=0x3c93690BBe585475FdfADaB3f59b4604008C7ac4&c=8453&tid=1&h=0xebee57cf2600aabca328750397f348b0fcb4e03449863c17c8305c887624ea4e&bh=0xfd6538c8182a8758bb52120ab0ee8820f4d1afc70f4dc1f0b52c9f7ff3e1bf18&bn=3656801&t=1694102949&wa=0x60B824cA6457330f923dd61cf14A011C3421BD6d&ms=1&mi=1&s=120&gp=0&gu=0'
  extract = fastExtract(inputUrl)
  expect(extract).toBe(inputUrl)
  expect(sanitizeIpfsUrl(inputUrl)).toBe(output)
})
