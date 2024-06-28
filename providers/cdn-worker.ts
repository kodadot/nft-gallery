import { type QueryValue, encodeQueryItem } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    dpr: 'dpr',
    fit: 'fit',
    gravity: 'g',
    quality: 'q',
    format: 'f',
    sharpen: 'sharpen',
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'scale-down',
      outside: 'crop',
      inside: 'pad',
    },
    gravity: {
      auto: 'auto',
      side: 'side',
    },
  },
  joinWith: ',',
  formatter: (key: string, val: QueryValue | QueryValue[]) =>
    encodeQueryItem(key, val),
})

const defaultModifiers = {}

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  const mergeModifiers = { ...defaultModifiers, ...modifiers }
  const operations = operationsGenerator(mergeModifiers as any)

  const match = src.match(/\/ipfs\/(.+)/)
  const cid = match ? encodeURI(match[1]) : null

  if (!cid || !operations) {
    return { url: src }
  }

  const url = new URL(src)
  url.search = operations

  return {
    url: url.toString(),
  }
}
