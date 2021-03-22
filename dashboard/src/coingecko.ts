import Axios from 'axios'

export const BASE_URL = 'https://api.coingecko.com/api/v3'

const api = Axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: false
  })

export default api
