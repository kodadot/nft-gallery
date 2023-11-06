import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'
import { CF_IMAGE_URL } from '@/utils/config/ipfs'

const operationsGenerator = createOperationsGenerator()

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL = CF_IMAGE_URL } = {},
) => {
  // https://image-beta.w.kodadot.xyz/ipfs/bafybeiatgshrpwwv4cw3kdi5xzvxvbgwtf7hfelbz54vwjwfkdltvcra3e
  // https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/bafybeiatgshrpwwv4cw3kdi5xzvxvbgwtf7hfelbz54vwjwfkdltvcra3e/public

  console.log(src)
  const cidRegex = /ipfs\/([a-zA-Z0-9]+)/
  const match = cidRegex.exec(src)
  if (!match) {
    return {
      url: src,
    }
  }
  const cid = match[1]

  if (!baseURL) {
    // also support runtime config
    baseURL = useRuntimeConfig().public.siteUrl
  }

  const operations = operationsGenerator(modifiers)
  const url = joinURL(baseURL, cid, '/public', operations ?? '')
  return {
    url,
  }
}
