import { $fetch } from 'ofetch'

const BASE_URL = isProduction
  ? 'https://playground.kodadot.workers.dev/'
  : 'https://playground-beta.kodadot.workers.dev/'

const PUBLIC_R2_BUCKET_URL = isProduction
  ? 'https://playground-r2.koda.art'
  : 'https://pub-adc77a8fecb9405b9573442870905a67.r2.dev'

const api = $fetch.create({
  baseURL: BASE_URL,
})

export const getObjectUrl = (key: string) => `${PUBLIC_R2_BUCKET_URL}/${key}`

type UploadFilesResponse = { key: string }

export const uploadFile = async ({
  file,
  fileName,
  prefix,
}: {
  file: Blob
  fileName: string
  prefix?: string
}) => {
  const form = new FormData()

  form.append('file', file, fileName)

  if (prefix) {
    form.append('prefix', prefix)
  }

  return await api<UploadFilesResponse>('/upload', {
    method: 'POST',
    body: form,
  })
}

type UploadAvailableResponse = { key: string }

export const getUpload = async (key: string) => {
  return await api<UploadAvailableResponse>('/upload', {
    method: 'GET',
    params: {
      key,
    },
  })
}
