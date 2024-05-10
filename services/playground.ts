import { $fetch } from 'ofetch'

const BASE_URL =
  window.location.host === 'kodadot.xyz'
    ? 'https://playground.kodadot.workers.dev/'
    : 'https://playground-beta.kodadot.workers.dev/'

const api = $fetch.create({
  baseURL: BASE_URL,
})

export const uploadFile = async (file: Blob, fileName: string) => {
  const form = new FormData()

  form.append('file', file, fileName)

  return await api('/upload', {
    method: 'POST',
    body: form,
  })
}
