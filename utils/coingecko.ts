import { $fetch } from 'ofetch'
import { URLS } from './constants'

export const COINGECKO_BASE_URL = URLS.providers.coingecko

const api = $fetch.create({
  baseURL: COINGECKO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'omit',
})

export const getPrice = async (id: string): Promise<any> => {
  try {
    const data = await api('/simple/price', {
      params: {
        ids: id,
        vs_currencies: 'usd',
      },
    })

    return data
  } catch (error) {
    console.log(error)
    return undefined
  }
}

// tokenMap but reversed
const tokenMap = {
  KSM: 'kusama',
  DOT: 'polkadot',
  BSX: 'basilisk',
}

export const getApproximatePriceOf = async (id: string): Promise<number> => {
  const coinId = tokenMap[id]
  const stored = process.client && localStorage.getItem(id)

  if (stored) {
    return Number(stored)
  }

  console.log('Fetching price from coingecko', id, coinId)

  const data = await getPrice(coinId)

  if (process.client && data) {
    const value: number = data[coinId]['usd']
    localStorage.setItem(id, String(value))
    return value
  }

  return 0
}

export const getKSMUSD = async (): Promise<number> => {
  const coinId = 'kusama'
  try {
    const data = await api('/simple/price', {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
      },
    })

    const value: number = data[coinId]['usd']
    if (process.client) {
      localStorage.setItem('KSM', String(value))
    }

    return value
  } catch (error) {
    console.log(error)
    return process.client && Number(localStorage.getItem('KSM') || 100)
  }
}

export default api
