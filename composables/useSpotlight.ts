import type { SomethingWithMeta } from '@/components/rmrk/utils'
import type { CollectionMetadata } from '@/components/rmrk/types'
import type { CarouselNFT } from '@/components/base/types'

import { getSanitizer } from '@/components/rmrk/utils'
import { mapOnlyMetadata } from '@/utils/mappers'
import {
  getCloudflareImageLinks,
  processMetadata,
} from '@/utils/cachingStrategy'
import { fastExtract } from '@/utils/ipfs'

const curatedCollection = {
  rmrk: [
    '800f8a914281765a7d-KITTY', // Kitty
    '2075be44ea4b9e422d-🐺', // WolfAngryClub
    '160a6f4320f11acb25-LCKWV', // PixelBabe
    '0a24c7876a892acb79-RADTOADZ', // RadToadz (ZestLifeLab)
    '7cf9daa38281a57331-BSS', // Spaceships (ClownWorldHouse)
    '900D19DC7D3C444E4C-KSMBOT', // KusamaBot (deepologics)
  ],
}

type Collections = CarouselNFT & SomethingWithMeta

export default function useSpotlight() {
  const collections = ref<Collections[]>([])
  const { urlPrefix } = usePrefix()
  const variables = curatedCollection[urlPrefix.value]?.length
    ? { list: curatedCollection[urlPrefix.value] }
    : undefined
  const { data } = useGraphql({
    queryName: 'collectionCuratedList',
    queryPrefix: urlPrefix.value,
    variables,
  })

  const updateCollections = async ({ data }) => {
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
        getSanitizer(meta.image || '')(meta.image || '')
    })
  }

  watch(data, async () => {
    updateCollections({ data: data.value })
  })

  return {
    collections,
    data,
  }
}
