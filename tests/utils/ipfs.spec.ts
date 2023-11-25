import * as isIPFS from 'is-ipfs'
import {
  fastExtract,
  replaceIpfsGateway,
  sanitizeIpfsCid,
  sanitizeIpfsUrl,
  toExternalUrl,
} from '../../utils/ipfs'
import { kodaImage } from '../../utils/config/ipfs'

it('should return proper url', () => {
  // ipfs path
  let inputUrl =
    'ipfs://ipfs/bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4'
  let output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4'
  let extract = fastExtract(inputUrl)
  expect(isIPFS.cid(extract)).toBe(true)
  expect(sanitizeIpfsCid(extract)).toBe(output)
  expect(sanitizeIpfsUrl(extract)).toBe(output)

  // ipfs sub path
  inputUrl =
    'ipfs://ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  extract = fastExtract(inputUrl)
  expect(isIPFS.cidPath(extract)).toBe(true)
  expect(sanitizeIpfsCid(extract)).toBe(output)
  expect(sanitizeIpfsUrl(extract)).toBe(output)

  // ipfs cid
  inputUrl = 'bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeihpbyskcjjhb5tnrjbsnsvzcfm2npjec3uf65n3o7stucta2rlos4'
  extract = fastExtract(inputUrl)
  expect(isIPFS.cid(extract)).toBe(true)
  expect(sanitizeIpfsCid(extract)).toBe(output)
  expect(sanitizeIpfsUrl(extract)).toBe(output)

  // ipfs cid sub path
  inputUrl =
    'bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  extract = fastExtract(inputUrl)
  expect(isIPFS.cidPath(extract)).toBe(true)
  expect(sanitizeIpfsCid(extract)).toBe(output)
  expect(sanitizeIpfsUrl(extract)).toBe(output)

  // ipfs from other gateway
  inputUrl =
    'https://cloudflare-ipfs.com/ipfs/bafkreia3j75r474kgxxmptwh5n43j5nrvn3du5l7dcfq2twh73wmagqs6m'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafkreia3j75r474kgxxmptwh5n43j5nrvn3du5l7dcfq2twh73wmagqs6m'
  extract = fastExtract(inputUrl)
  expect(isIPFS.url(extract)).toBe(true)
  expect(replaceIpfsGateway(extract)).toBe(output)
  expect(sanitizeIpfsUrl(extract)).toBe(output)

  // ipfs sub path from other gateway
  inputUrl =
    'https://cloudflare-ipfs.com/ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafybeidrhkocxp3zjs2ps4chfsnszkucyzh6hz3jvehr6bj3ek3xzxti5y/S01_Map_Coll_Meta.json'
  extract = fastExtract(inputUrl)
  expect(isIPFS.url(extract)).toBe(true)
  expect(replaceIpfsGateway(extract)).toBe(output)
  expect(sanitizeIpfsUrl(extract)).toBe(output)

  // ipfs from koda gateway
  inputUrl =
    'https://image-beta.w.kodadot.xyz/ipfs/bafkreia3j75r474kgxxmptwh5n43j5nrvn3du5l7dcfq2twh73wmagqs6m'
  output =
    'https://image-beta.w.kodadot.xyz/ipfs/bafkreia3j75r474kgxxmptwh5n43j5nrvn3du5l7dcfq2twh73wmagqs6m'
  extract = fastExtract(inputUrl)
  expect(isIPFS.url(extract)).toBe(true)
  expect(replaceIpfsGateway(extract)).toBe(output)
  expect(sanitizeIpfsUrl(extract)).toBe(output)

  // external url
  inputUrl =
    'https://polkadot-data.s3.us-east-2.amazonaws.com/metadata/nfts-88/nfts-88_item-5413-meta.json'
  output =
    'https://image-beta.w.kodadot.xyz/type/url?endpoint=https%3A%2F%2Fpolkadot-data.s3.us-east-2.amazonaws.com%2Fmetadata%2Fnfts-88%2Fnfts-88_item-5413-meta.json'
  extract = fastExtract(inputUrl)
  expect(isIPFS.url(extract)).toBe(false)
  expect(toExternalUrl(extract)).toBe(output)
  expect(sanitizeIpfsUrl(extract)).toBe(output)

  // external url from workers
  inputUrl =
    'https://image-beta.w.kodadot.xyz/type/url?endpoint=https%3A%2F%2Fpolkadot-data.s3.us-east-2.amazonaws.com%2Fmetadata%2Fnfts-88%2Fnfts-88_item-5413-meta.json'
  extract = fastExtract(inputUrl)
  expect(isIPFS.url(extract)).toBe(false)
  expect(extract.includes(kodaImage)).toBe(true)
  expect(sanitizeIpfsUrl(extract)).toBe(output)
})
