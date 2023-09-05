import type { NFT } from '@/components/rmrk/service/scheme'

export interface NFTListSold {
  nftEntities?: NFT[]
  nftEntitiesConnection: {
    totalCount: number
  }
}

export function useIdentitySoldData({ address }, collectionId?) {
  const nftEntities = ref<NFT[]>([])
  let collectionObject = {}
  if (collectionId) {
    collectionObject = {
      collectionId,
      where: {
        collection: { id_eq: collectionId },
      },
    }
  }

  const { data } = useGraphql({
    queryName: 'nftListSold',
    variables: {
      account: address,
      limit: 3,
      orderBy: 'price_DESC',
      ...collectionObject,
    },
  })

  watch(data as unknown as NFTListSold, (list) => {
    if (list.nftEntities?.length) {
      nftEntities.value = list.nftEntities
    }
  })

  return { nftEntities }
}
