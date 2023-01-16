import { MediaType } from '~/components/rmrk/types'
import { resolveMedia } from '~/utils/gallery/media'

declare module 'vue/types/vue' {
  // this.$seoMeta inside Vue components
  interface Vue {
    $seoMeta(meta: MetaProperties)
  }
}

interface MetaProperties {
  type?: string
  url?: string
  title?: string
  description?: string
  image?: string
  author?: string
  video?: string
  mime?: string
}

interface MetaTag {
  hid?: string
  name?: string
  property?: string
  content?: string
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

  const seoMeta = (meta: MetaProperties): MetaTag[] => {
    const baseUrl: string = app.$config.public.baseUrl
    const title = 'KodaDot - Kusama NFT Market Explorer'
    const description = 'Creating Carbonless NFTs on Kusama'
    const image = `${baseUrl}/k_card.png`
    const type = resolveMedia(meta?.mime)

    const seoTags: MetaTag[] = [
      {
        hid: 'title',
        name: 'title',
        content: meta?.title ? `${meta.title} | ${title}` : title,
      },
      {
        hid: 'description',
        name: 'description',
        content: meta?.description || description,
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: getMetaType(type),
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: `${baseUrl}${meta?.url || ''}`,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: meta?.title ? `${meta.title} | ${title}` : title,
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

    if (type === MediaType.IMAGE) {
      const imageMetaTags: MetaTag[] = [
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: meta?.mime,
        },
      ]
      seoTags.push(...imageMetaTags)
    }

    if (type === MediaType.VIDEO) {
      const videoMetaTags: MetaTag[] = [
        {
          hid: 'og:video',
          property: 'og:video',
          content: meta?.video,
        },
        {
          hid: 'og:video:width',
          property: 'og:video:width',
          content: '1280',
        },
        {
          hid: 'og:video:height',
          property: 'og:video:height',
          content: '720',
        },
        {
          hid: 'og:video:type',
          property: 'og:video:type',
          content: meta?.mime,
        },
        {
          hid: 'twitter:player:width',
          property: 'twitter:player:width',
          content: '1280',
        },
        {
          hid: 'twitter:player:height',
          property: 'twitter:player:height',
          content: '720',
        },
        {
          hid: 'twitter:card',
          property: 'twitter:card',
          content: 'player',
        },
        {
          hid: 'twitter:player',
          name: 'twitter:player',
          content: meta?.video,
        },
      ]
      seoTags.push(...videoMetaTags)
    }

    // only return non null, not undefined, not empty string
    return seoTags.filter((tag: MetaTag) => tag && tag.content !== '')
  }
  inject('seoMeta', seoMeta)
}
