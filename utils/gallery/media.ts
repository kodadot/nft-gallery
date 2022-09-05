import { $fetch } from 'ohmyfetch'

import { MediaType } from '~/components/rmrk/types'

const mediaWithoutImage = [
  MediaType.VIDEO,
  MediaType.MODEL,
  MediaType.IFRAME,
  MediaType.AUDIO,
  MediaType.OBJECT,
]

export function isImageVisible(type: MediaType) {
  return mediaWithoutImage.every((media) => media !== type)
}

export async function getMimeType(mediaUrl: string) {
  const { type } = await $fetch(mediaUrl, { method: 'HEAD' })
  return type
}

export async function processMedia(mediaUrl: string) {
  const mimeType = await getMimeType(mediaUrl)
  const type = resolveMedia(mimeType)

  return {
    mimeType,
    imageVisible: isImageVisible(type),
  }
}

export function resolveMedia(mimeType?: string): MediaType {
  if (!mimeType) {
    return MediaType.UNKNOWN
  }

  if (/^application\/json/.test(mimeType)) {
    return MediaType.MODEL
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

  if (/^audio/.test(mimeType)) {
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

  return result
}
