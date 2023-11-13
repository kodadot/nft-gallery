import { $fetch } from 'ofetch'
import { URLS } from './constants'

export const COINGECKO_BASE_URL = URLS.providers.coingecko
export const KODAPRICE_BASE_URL = URLS.providers.kodaprice

let status = 0
const baseApi = {
  headers: {
    'Content-Type': 'application/json',
  },
  ignoreResponseError: true,
  async onRequest() {
    status = 0
  },
  async onResponse({ response }) {
    status = response.status
  },
}

const coingeckoApi = $fetch.create({
  ...baseApi,
  baseURL: COINGECKO_BASE_URL,
  credentials: 'omit',
})

const kodapriceApi = $fetch.create({
  ...baseApi,
  baseURL: KODAPRICE_BASE_URL,
})

// types from https://coinprice.kodadot.workers.dev/price/kusama
// or https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd
type GetPrice = {
  [key: string]: {
    usd: number
  }
}

export const getPrice = async (id: string): Promise<GetPrice> => {
  const emptyPrice = { [id]: { usd: 0 } }

  // fetch kodaprice
  const dataKodaprice = await kodapriceApi(`/price/${id}`)
  if (status === 200) {
    return dataKodaprice
  }

  // fallback to coingecko
  const dataCoingecko = await coingeckoApi('/simple/price', {
    params: {
      ids: id,
      vs_currencies: 'usd',
    },
  })
  if (status === 200) {
    return dataCoingecko
  }

  return emptyPrice
}

// tokenMap but reversed
const tokenMap = {
  KSM: 'kusama',
  DOT: 'polkadot',
  BSX: 'basilisk',
}

export const getApproximatePriceOf = async (id: string): Promise<number> => {
  const coinId = tokenMap[id]

  console.log('Fetching price from coingecko', id, coinId)

  const data = await getPrice(coinId)

  if (data) {
    const value: number = data[coinId]['usd']
    return value
  }

  return 0
}

export default kodapriceApi
