import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { getMimeType } from '@/utils/gallery/media'
import { useHistoryStore } from '@/stores/history'
import { NftResources, getNftMetadata } from '@/composables/useNft'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import type { NFT } from '@/components/rmrk/service/scheme'
import type { NFTWithMetadata } from '@/composables/useNft'
import useCachedGraphql from '@/composables/useCachedGraphql'

interface NFTData {
  nftEntity?: NFTWithMetadata
}

const whichMimeType = async (data) => {
  if (data?.type) {
    return data?.type
  }
  if (data?.animation_url) {
    return await getMimeType(sanitizeIpfsUrl(data.animation_url))
  }
  if (data?.image || data?.mediaUri) {
    return await getMimeType(sanitizeIpfsUrl(data?.image || data?.mediaUri))
  }

  return ''
}

const whichAsset = (data) => {
  return {
    animation_url: sanitizeIpfsUrl(data.animation_url || ''),
    image: sanitizeIpfsUrl(data.image || data.mediaUri || '', 'image'),
  }
}

export const useGalleryItem = (nftId?: string) => {
  const { $consola } = useNuxtApp()
  const historyStore = useHistoryStore()
  const nft = ref<NFT>()
  const nftImage = ref('')
  const nftAnimation = ref('')
  const nftMimeType = ref('')
  const nftMetadata = ref<NFTWithMetadata>()
  const nftResources = ref<NftResources[]>()

  const { params } = useRoute()
  const id = nftId || params.id
  // const { id: collectionID, item: id } = tokenIdToRoute(params.id)

  const queryPath = {
    rmrk: 'chain-rmrk',
    ksm: 'chain-ksm',
    stmn: 'chain-stmn',
  }

  const { urlPrefix } = usePrefix()

  const DoFetch = useCachedGraphql({
    queryPrefix: queryPath[urlPrefix.value] || urlPrefix.value,
    queryName: 'nftById',
    variables: { id },
    options: {
      fetchPolicy: 'network-only',
    },
    staleTime: 3000,
  })

  const queryResult = DoFetch<NFTData>()

  watchEffect(async () => {
    const { data } = queryResult
    const nftEntity = data.value?.nftEntity
    if (!nftEntity) {
      $consola.log(`NFT with id ${id} not found. Fallback to RPC Node`)
      return
    }

    nft.value = nftEntity

    const resources = nftEntity.resources?.map((resource) => {
      return {
        ...resource,
        src: sanitizeIpfsUrl(resource.meta.animationUrl || resource.src),
        thumb: sanitizeIpfsUrl(resource.thumb || resource.meta.image),
        animation: sanitizeIpfsUrl(resource.meta.animationUrl),
      }
    })

    nftMetadata.value = await getNftMetadata(nftEntity, urlPrefix.value)
    nftMimeType.value = await whichMimeType(nftMetadata.value)
    nftResources.value = resources

    const asset = whichAsset(nftMetadata.value)
    nftImage.value = asset.image
    nftAnimation.value = asset.animation_url

    historyStore.addHistoryItem({
      id: nft.value.id,
      name: nft.value.name,
      image: nftImage.value,
      collection: nft.value.collection.name,
      date: new Date(),
      description: nftMetadata.value?.description,
      author: nft.value.currentOwner,
      price: nft.value.price,
      mimeType: nftMimeType.value,
      prefix: urlPrefix,
    })
  })

  useSubscriptionGraphql({
    query: `   nft: nftEntityById(id: "${id}") {
      id
      currentOwner
      price
      burned
      events {
        id
      }
    }`,
    onChange: () => {
      if (queryResult.isStale.value) {
        queryResult.refetch()
      }
    },
  })

  return {
    nft,
    nftImage,
    nftAnimation,
    nftMimeType,
    nftMetadata,
    nftResources,
  }
}
