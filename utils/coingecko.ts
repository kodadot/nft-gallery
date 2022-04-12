import Axios from 'axios'

export const BASE_URL = 'https://api.coingecko.com/api/v3'

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

export const getKsmPrice = async (): Promise<void> => {
  try {
    const { data } = await api.get('/simple/price', {
      params: {
        ids: 'kusama',
        vs_currencies: 'usd',
      },
    })

    return data
  } catch (error) {
    console.log(error)
  }
}

export const getKSMUSD = async (): Promise<number> => {
  const coinId = 'kusama'
  try {
    const { data } = await api.get('/simple/price', {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
      },
    })

    const value: number = data[coinId]['usd']
    localStorage.setItem('KSM', String(value))

    return value
  } catch (error) {
    console.log(error)
    return Number(localStorage.getItem('KSM') || 100)
  }
}

export default api
