import { kodaImage } from '@/utils/config/ipfs'

type StreamDownload = {
  url: string
  uid: string
  detail?: {
    thumbnail: string
  }
  video?: {
    default?: {
      url: string
      percentComplete: number
    }
  }
}

const workerUrl = new URL(kodaImage)

export async function getCloudflareMp4(url): Promise<StreamDownload> {
  const kodaUrl = new URL(url)
  const infura = `https://kodadot1.infura-ipfs.io${kodaUrl.pathname}`

  workerUrl.pathname = '/video/download'

  const video = await $fetch(workerUrl.toString(), {
    method: 'POST',
    body: {
      videoUrl: infura,
    },
  })

  return video as StreamDownload
}
