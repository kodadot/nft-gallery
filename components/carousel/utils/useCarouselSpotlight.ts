import type { SomethingWithMeta, getSanitizer } from '@/utils/ipfs'
import type { CollectionMetadata } from '@/components/rmrk/types'
import type { CarouselNFT } from '@/components/base/types'

import { mapOnlyMetadata } from '@/utils/mappers'
import {
  getCloudflareImageLinks,
  processMetadata,
} from '@/utils/cachingStrategy'
import { fastExtract } from '@/utils/ipfs'

const curatedCollection = {
  rmrk: [
    '8adee5c0c132c32e6a-🎵QMB🎵', // 🎵Quakz Music Box🎵
    '800f8a914281765a7d-KITTY', // Kitty
    '2075be44ea4b9e422d-🐺', // WolfAngryClub
    '160a6f4320f11acb25-LCKWV', // PixelBabe
    '0a24c7876a892acb79-RADTOADZ', // RadToadz (ZestLifeLab)
    '7cf9daa38281a57331-BSS', // Spaceships (ClownWorldHouse)
    '900D19DC7D3C444E4C-KSMBOT', // KusamaBot (deepologics)
  ],
}

type Collections = CarouselNFT & SomethingWithMeta

const useSpotlightNft = () => useState<Collections[]>('nfts', () => [])

async function updateCollections(data) {
  const collections = useSpotlightNft()

  if (!data?.collectionEntities?.length) {
    return
  }

  collections.value = data.collectionEntities.map((e) => ({
    ...e,
    metadata: e.meta?.id || e.metadata,
    image: '',
  })) as Collections[]
  const metadataList: string[] = collections.value.map(mapOnlyMetadata)
  const imageLinks = await getCloudflareImageLinks(metadataList)

  processMetadata<CollectionMetadata>(metadataList, (meta, i) => {
    collections.value[i].image =
      imageLinks[fastExtract(collections.value[i]?.metadata)] ||
      getSanitizer(meta.image || '', 'image')(meta.image || '')
  })
}

export default function useCarouselSpotlight() {
  const collections = useSpotlightNft()
  const { urlPrefix } = usePrefix()
  const variables = curatedCollection[urlPrefix.value]?.length
    ? { list: curatedCollection[urlPrefix.value] }
    : undefined
  const { data } = useGraphql({
    queryName: 'collectionCuratedList',
    queryPrefix: urlPrefix.value,
    variables,
  })

  watch(data, () => {
    updateCollections(data.value)
  })

  return {
    collections: computed(() => collections.value),
    data,
  }
}
