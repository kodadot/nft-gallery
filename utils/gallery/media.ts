import { $fetch } from 'ofetch'

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
  const { headers } = await $fetch.raw(mediaUrl, { method: 'HEAD' })
  return headers.get('content-type') || ''
}

export async function processMedia(mediaUrl: string) {
  const mimeType = await getMimeType(mediaUrl)
  const type = resolveMedia(mimeType)

  return {
    mimeType,
    imageVisible: isImageVisible(type),
  }
}

const tests = [
  {
    checkFn: (mimeType) => /^application\/json/.test(mimeType),
    returnVal: MediaType.JSON,
  },
  {
    checkFn: (mimeType) => /^model\/gltf-binary/.test(mimeType),
    returnVal: MediaType.MODEL,
  },
  {
    checkFn: (mimeType) => /^text\/html/.test(mimeType),
    returnVal: MediaType.IFRAME,
  },
  {
    checkFn: (mimeType) => /^image\/svg\+xml/.test(mimeType),
    returnVal: MediaType.IMAGE,
  },
  {
    checkFn: (mimeType) => /^application\/pdf/.test(mimeType),
    returnVal: MediaType.OBJECT,
  },
  {
    checkFn: (mimeType) => /^audio/.test(mimeType),
    returnVal: MediaType.AUDIO,
  },
]

export function resolveMedia(mimeType?: string): MediaType {
  if (!mimeType) {
    return MediaType.UNKNOWN
  }

  tests.forEach(({ checkFn, returnVal }) => {
    if (checkFn(mimeType)) {
      return returnVal
    }
  })

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
