export enum MediaType {
  VIDEO = 'Video',
  MODEL = 'Model',
  IMAGE = 'Image',
  AUDIO = 'Audio',
  JSON = 'Json',
  TEXT = 'Text',
  IFRAME = 'IFrame',
  UNKNOWN = 'Unknown',
  OBJECT = 'Object',
}

export const mediaTypeElementSelectors: Record<
  Extract<
    MediaType,
    MediaType.IMAGE | MediaType.VIDEO | MediaType.OBJECT | MediaType.IFRAME
  >,
  string
> = {
  [MediaType.IMAGE]: 'img[data-nuxt-img]',
  [MediaType.VIDEO]: 'video',
  [MediaType.OBJECT]: 'object',
  [MediaType.IFRAME]: 'iframe[title="html-embed"]',
}

export const determineElementType = (animationType, imageType) =>
  [MediaType.IFRAME, MediaType.VIDEO].includes(animationType)
    ? animationType
    : imageType

export async function getMimeType(mediaUrl: string) {
  try {
    const { headers } = await $fetch.raw(mediaUrl, {
      method: mediaUrl.includes('w.kodadot.xyz') ? 'GET' : 'HEAD',
    })
    return headers.get('content-type') || ''
  }
  catch (error) {
    return ''
  }
}

export const isAudio = (mimeType: string): boolean => /^audio/.test(mimeType)

export function resolveMedia(mimeType?: string): MediaType {
  if (!mimeType) {
    return MediaType.UNKNOWN
  }

  if (/^application\/json/.test(mimeType)) {
    return MediaType.JSON
  }

  if (/^model\/gltf-binary/.test(mimeType)) {
    return MediaType.MODEL
  }

  if (/^text\/html/.test(mimeType)) {
    return MediaType.IFRAME
  }

  if (/^image\/svg\+xml/.test(mimeType)) {
    return MediaType.IMAGE
  }

  if (/^application\/pdf/.test(mimeType)) {
    return MediaType.OBJECT
  }

  if (isAudio(mimeType)) {
    return MediaType.AUDIO
  }

  const match = mimeType.match(/^[a-z]+/)

  if (!match) {
    return MediaType.UNKNOWN
  }

  const prefix = match[0].toUpperCase()

  let result = MediaType.UNKNOWN

  Object.entries(MediaType).forEach(([type, value]) => {
    if (type === prefix) {
      result = value
      return
    }
  })

  return result ?? MediaType.UNKNOWN
}

export const DEFAULT_MEDIA_ICON = 'i-mdi:file-image-box'

export const getMediaIcon = (type: string) => {
  if (type.includes('gif')) return 'i-mdi:file-gif-box'
  if (type.includes('video')) return 'i-mdi:video'
  if (type.includes('audio')) return 'i-mdi:music'
  if (type.includes('pdf')) return 'i-mdi:file-pdf-box'
  return DEFAULT_MEDIA_ICON
}
