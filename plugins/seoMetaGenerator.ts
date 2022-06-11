import { filter } from 'lodash'
import type { MetaInfo } from 'vue-meta'
import { MediaType } from '~/components/rmrk/types'

declare module 'vue/types/vue' {
  // this.$seoMeta inside Vue components
  interface Vue {
    $seoMeta(meta: MetaProperties)
  }
}

type MetaProperties = {
  type?: string
  url?: string
  title?: string
  description?: string
  image?: string
  author?: string
  video?: string
}

export default function ({ app }, inject): void {
  const getMetaType = (mediaType: MediaType | string | undefined): string => {
    switch (mediaType) {
      case MediaType.VIDEO:
        return 'video:other'
      case MediaType.AUDIO:
        return 'music:song'
      case MediaType.IMAGE:
      case MediaType.JSON:
      case MediaType.OBJECT:
      default:
        return 'website'
    }
  }

  const seoMeta = (meta: MetaProperties): MetaInfo['meta'] => {
    const baseUrl: string = app.$config.baseUrl
    const title = 'KodaDot - Kusama NFT Market Explorer'
    const description = 'Creating Carbonless NFTs on Kusama'
    const image = `${baseUrl}/kodadot_card_root.png`

    const seoTags = [
      {
        hid: 'description',
        name: 'description',
        content: meta?.description || description,
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: getMetaType(meta?.type),
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: `${baseUrl}${meta?.url || ''}`,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: meta?.title || title,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: meta?.description || description,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: meta?.image || image,
      },
      {
        hid: 'og:video',
        property: 'og:video',
        content: meta?.video,
      },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: `${baseUrl}${meta?.url || ''}`,
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: meta?.title || title,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: meta?.description || description,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: meta?.image || image,
      },
    ]

    // only return non null, not undefined, not empty string
    return filter(seoTags, (tag) => tag && tag.content !== '')
  }
  inject('seoMeta', seoMeta)
}
