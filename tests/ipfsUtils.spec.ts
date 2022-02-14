import { fastExtract } from '@/utils/ipfs'
import { getCloudflareImageLinks } from '@/utils/cachingStrategy'

describe('IPFS UTILS TEST', (): void => {
  let ipfsUrlList: string[]

  beforeAll(async () => {
    ipfsUrlList = [
      'ipfs://ipfs/bafkreifqhjpyzonmff7x2wmlqnsrniuodzrrtsz6ruz3rgtogffdcvqt3m',
      'ipfs://ipfs/bafkreibv426brrflmozbukxcbvg6qopbtgjwn3xtdlblgc5g4yqgkjekiy',
      'ipfs://ipfs/bafkreihv477avwjq7ycyhffd3rbtigvrmi2aup4mjhicdqbi2vnnjyas6u',
      'ipfs://ipfs/bafkreiemco5ndzut5iluxnzt4xsd36njz7ndg7impn2imeoxxw2btjcwhq',
      'ipfs://ipfs/bafkreig3wqfkjy4is6e76zryx7cp7gcenmbwx2cmejvkymso4atx56ingu',
      'ipfs://ipfs/bafkreigmhitrhk6w3wgloifuokss27krx6og24mo3eozkep6jeg54pptbi',
      'ipfs://ipfs/bafkreicw6yndjbycxzjyui5myppqz4zgcpsvxposkeg36nofgkoanlhfyi',
      'ipfs://ipfs/bafkreigg67ucux2y4oj3sxgift2fozpqk7x4w7ft3nrjuypstimqg5xuiu',
      'ipfs://ipfs/bafkreiaz7kj76xyhjxh3hhus6gjgq44tkwgcjfl44f3s3jcpty7tqgcd7a',
      'ipfs://ipfs/bafkreibc7ekujg2zzciuxmakw7q5objcsujyqkupaatg7hczybu7363rvq',
      'ipfs://ipfs/bafkreigny4gnlt2lsn3terlclkrmocvpqlqeb4zs3yhv3smq6542t4wddi',
      'ipfs://ipfs/bafkreigfd2gzate3fw6fvql4dfzddwhk6cdctgok2c4q4bd3k4ydlyhm3q',
    ]
  })

  it('can fast extract', () => {
    const extracted = fastExtract(ipfsUrlList[0])
    expect(extracted).toBe('bafkreifqhjpyzonmff7x2wmlqnsrniuodzrrtsz6ruz3rgtogffdcvqt3m')
  })

  // it('can correctlyBuild a cache map', async () => {
  //   const urls = await getCloudflareImageLinks(ipfsUrlList)
  //   const extracted = fastExtract(ipfsUrlList[0])
  //   console.log(urls)
  //   expect(urls[extracted]).toBeDefined()
  // })
})
