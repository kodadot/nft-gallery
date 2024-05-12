import { $fetch } from 'ofetch'

const BASE_URL =
  window.location.host === 'kodadot.xyz'
    ? 'https://playground.kodadot.workers.dev/'
    : 'https://playground-beta.kodadot.workers.dev/'

const api = $fetch.create({
  baseURL: BASE_URL,
})

type UploadFilesResponse = { key: string }

export const uploadFile = async (file: Blob, fileName: string) => {
  const form = new FormData()

  form.append('file', file, fileName)

  return await api<UploadFilesResponse>('/upload', {
    method: 'POST',
    body: form,
  })
}

type UploadPresignedResponse = { url: string }

export const uploadPresigned = async (key: string, query = {}) => {
  return await api<UploadPresignedResponse>('/upload-presigned', {
    method: 'POST',
    body: {
      key,
      query,
    },
  })
}
