import Axios from 'axios'

export const BASE_URL = 'https://ipfs.io/'

const api = Axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false,
  })

export default api
