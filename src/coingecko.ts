import Axios from 'axios'

export const BASE_URL = 'https://api.coingecko.com/api/v3'

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})


export const getKSMUSD = async (): Promise<number> => {
  const coinId = 'kusama'
  try {
    const { data } = await api.get('/simple/price', {
      params: {
        ids: coinId,
        vs_currencies: 'usd'
      }
    })

    return data[coinId]['usd']
  } catch (error) {
    console.log(error)
    return 1
  }
}

export default api
