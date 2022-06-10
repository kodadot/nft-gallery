import Axios from 'axios'

export const BASE_URL =
  'https://petersopko.api.stdlib.com/imagedescription@dev/' // TODO: @petersopko

const api = Axios.create({
  baseURL: BASE_URL,
})

export type GptResponse = {
  title: string
  description: string
}

export const askGpt = async (url: string) => {
  const { status, data } = await api.post<GptResponse>(
    'titleDescriptionGenerator',
    { url }
  )
  console.log('[GPT::askGpt]', status)
  return data
}
