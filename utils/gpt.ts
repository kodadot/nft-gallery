import Axios from 'axios'

export const BASE_URL = '' // TODO: @petersopko

const api = Axios.create({
  baseURL: BASE_URL,
})

export type GptResponse = {
	title: string,
	description: string,
}

export const askGpt = async (url: string) => {
  // const { status, data } = await api.get<GptResponse>(`askGpt/${url}`)
  // console.log(status)
  const data: GptResponse = {
    title: 'Very good title',
    description: `Very good ${url}`,
  }
  return data
}
