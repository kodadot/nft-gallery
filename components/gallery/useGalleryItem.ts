import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { useHistoryStore } from '@/stores/history'
import { getNftMetadata } from '@/composables/useNft'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { getCloudflareMp4 } from '@/services/imageWorker'
import type { NFTWithMetadata, NftResources, NFTOffer } from '@/composables/useNft'
import { getMimeType } from '@/utils/gallery/media'
import { getDrops } from '@/services/fxart'
import { fetchOdaCollectionAbi } from '@/services/oda'
import type { Abi } from '@/composables/transaction/types'

interface NFTData {
  nftEntity?: NftEntity
}

type NftEntity = NFTWithMetadata & { dropCreator?: string }

export interface GalleryItem {
  nft: Ref<NftEntity | undefined>
  nftMimeType: Ref<string>
  nftMetadata: Ref<NFTWithMetadata | undefined>
  nftAnimation: Ref<string>
  nftAnimationMimeType: Ref<string>
  nftImage: Ref<string>
  nftResources: Ref<NftResources[] | undefined>
  nftHighestOffer: Ref<NFTOffer | undefined>
  abi: Ref<Abi | null | undefined>
}

export const useGalleryItem = (nftId?: string): GalleryItem => {
  const { $consola } = useNuxtApp()
  const historyStore = useHistoryStore()
  const nft = ref<NftEntity>()
  const nftImage = ref('')
  const nftAnimation = ref('')
  const nftAnimationMimeType = ref('')
  const nftMimeType = ref('')
  const nftMetadata = ref<NFTWithMetadata>()
  const nftResources = ref<NftResources[]>()
  const nftHighestOffer = ref<NFTOffer>()
  const isOfferIndexerDisabled = computed(() => urlPrefix.value !== 'ahp')

  const { params } = useRoute()
  const id = nftId || params.id
  // const { id: collectionID, item: id } = tokenIdToRoute(params.id)

  const queryPath = {
    ahk: 'chain-ahk',
  }

  const { isIos, isSafari } = useDevice()
  const { urlPrefix } = usePrefix()
  const { data, refetch } = useGraphql({
    queryName: 'nftById',
    queryPrefix: queryPath[urlPrefix.value],
    variables: {
      id,
    },
  })

  const { data: nftOfferData, refetch: refetchHighestOffer } = useGraphql({
    queryName: 'highestOfferByNftId',
    disabled: isOfferIndexerDisabled,
    variables: {
      id,
    },
  })

  const { data: abi } = useQuery({
    queryKey: ['collection-abi', nft.value?.collection.id],
    queryFn: () => isEvm(urlPrefix.value) ? fetchOdaCollectionAbi(urlPrefix.value, nft.value?.collection.id as string) : Promise.resolve(null),
    enabled: computed(() => Boolean(nft.value)),
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
    onChange: refetch,
  })

  useSubscriptionGraphql({
    query: `offers(where: {status_eq: ACTIVE, desired: {id_eq: "${id}"}}, orderBy: price_DESC, limit: 1) {
      id
    }`,
    disabled: isOfferIndexerDisabled,
    onChange: refetchHighestOffer,
  })

  watch(data as unknown as NFTData, async (newData) => {
    const nftEntity = newData?.nftEntity
    if (!nftEntity) {
      $consola.log(`NFT with id ${id} not found. Fallback to RPC Node`)
      return
    }

    if (nftEntity.collection.id) {
      await getDrops({
        collection: nftEntity.collection.id,
        chain: [urlPrefix.value],
      }).then((drops) => {
        if (drops && drops[0]?.creator) {
          nftEntity.dropCreator = drops[0].creator
        }
      })
    }

    nft.value = nftEntity

    const resources = nftEntity.resources?.map((resource, index) => {
      const imageSrc
        = resource.meta?.animationUrl
        || resource.src
        || resource.meta?.image
        || resource.thumb

      let animationUrl = resource.meta?.animationUrl

      if (index === 0 && !animationUrl) {
        animationUrl = nftEntity.meta.animation_url
      }

      return {
        ...resource,
        src: sanitizeIpfsUrl(imageSrc),
        thumb: sanitizeIpfsUrl(resource.thumb || resource.meta?.image),
        animation: sanitizeIpfsUrl(animationUrl),
      }
    })

    const metadata = await getNftMetadata(nftEntity, urlPrefix.value, true)
    nftMetadata.value = metadata
    nftResources.value = resources

    nftAnimation.value
      = sanitizeIpfsUrl(metadata.animationUrl || metadata.animation_url) || ''
    nftAnimationMimeType.value
      = metadata.animationUrlMimeType
      || (nftAnimation.value && (await getMimeType(nftAnimation.value)))
      || ''
    nftImage.value = sanitizeIpfsUrl(metadata.image) || ''
    nftMimeType.value
      = metadata.imageMimeType
      || metadata.type
      || (nftImage.value && (await getMimeType(nftImage.value)))
      || ''

    // use cf-video & replace the video thumbnail
    if (
      nftAnimationMimeType.value.includes('video')
      || nftMimeType.value.includes('video')
    ) {
      // fallback to cloudflare-ipfs for ios & safari while video is still processing to cf-stream
      if (isIos || isSafari) {
        nftImage.value = sanitizeIpfsUrl(nft.value.meta?.image, 'cloudflare')
        nftAnimation.value = sanitizeIpfsUrl(
          nft.value.meta?.animation_url,
          'cloudflare',
        )
      }

      // serve video from cloudflare stream
      const streams = await getCloudflareMp4(
        metadata.animationUrl || metadata.image,
      )

      if (streams.uid && streams.video?.default?.percentComplete === 100) {
        nftAnimation.value = streams.video.default.url
        nftImage.value = streams.detail?.thumbnail || ''
      }
    }

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

  watch(nftOfferData as unknown as { offers: NFTOffer[] }, (newData) => {
    if (newData && newData.offers && newData.offers[0]) {
      nftHighestOffer.value = newData.offers[0]
    }
  })

  return {
    nft,
    nftImage,
    nftAnimation,
    nftAnimationMimeType,
    nftMimeType,
    nftMetadata,
    nftResources,
    nftHighestOffer,
    abi,
  }
}
