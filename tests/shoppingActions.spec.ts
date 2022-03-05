/**
 * @jest-environment jsdom
 */

jest.mock('@/queries/nftById.graphql', () => ({
  default: 'mockedDefaultExport',
  namedExport: jest.fn(),
}))

import {
  submitAction,
  checkBuyBeforeSubmit,
  getActions,
  ownerActions,
  buyActions,
} from '@/components/rmrk/shoppingActions'

describe('GET ACTIONS TEST', (): void => {
  it('owner actions', () => {
    const actions = getActions(true, false)
    expect(actions).toBe(ownerActions)
  })
  it('can buy', () => {
    const actions = getActions(false, true)
    expect(actions).toBe(buyActions)
  })
  it('has no action', () => {
    const actions = getActions(false, false)
    expect(actions.length).toBe(0)
  })
})

describe('SUBMIT ACTION TEST', (): void => {
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

  it('checkBuyBeforeSubmit TEST 1', async () => {
    const fn = () =>
      checkBuyBeforeSubmit({
        price: 1,
        currentOwnerId: 'xxxx',
        apollo: {
          query: () => ({
            data: {
              nFTEntity: {
                price: 1,
                currentOwner: 'xxxx',
                burned: false,
              },
            },
          }),
        },
      })
    expect(fn).not.toThrow(Error)
  })
  it('checkBuyBeforeSubmit TEST 2', async () => {
    const fn = () =>
      checkBuyBeforeSubmit({
        price: 4.5,
        currentOwnerId: 'id',
        apollo: {
          query: () => ({
            data: {
              nFTEntity: {
                price: 4.5,
                currentOwner: 'id',
                burned: false,
              },
            },
          }),
        },
      })
    expect(fn).not.toThrow(Error)
  })

  const commonParm = {
    urlPrefix: 'prefix',
    accountId: 'xxx',
    version: 'version',
    meta: 'meta',
    nftId: 'nftId',
    metaValid: true,
    currentOwnerId: 'id',
    price: 2,
    apollo: {
      query: () => ({
        data: {
          nFTEntity: {
            price: 4.5,
            currentOwner: 'id',
            burned: false,
          },
        },
      }),
    },
    ipfsHashes: ipfsUrlList,
  }

  it('submitAction test: has not action', async () => {
    const fn = () =>
      submitAction({
        ...commonParm,
      }).catch((e) => {
        expect(e).toBeInstanceOf(TypeError)
      })
    await fn()
  })
})
