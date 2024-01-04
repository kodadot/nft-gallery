type StreamDownload = {
  url: string
  uid: string
  video?: {
    default?: {
      url: string
      percentComplete: number
    }
  }
}

export async function getMp4(url): Promise<StreamDownload> {
  const kodaUrl = new URL(url)
  const infura = `https://kodadot1.infura-ipfs.io${kodaUrl.pathname}`

  const video = await $fetch('http://localhost:8787/video/download', {
    method: 'POST',
    body: {
      videoUrl: infura,
    },
  })

  return video as StreamDownload
}
