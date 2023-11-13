import { $fetch } from 'ofetch'
import { URLS } from './constants'

export const COINGECKO_BASE_URL = URLS.providers.coingecko
export const KODAPRICE_BASE_URL = URLS.providers.kodaprice

const coingeckoApi = $fetch.create({
  baseURL: COINGECKO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'omit',
})

const kodapriceApi = $fetch.create({
  baseURL: KODAPRICE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// types from https://coinprice.kodadot.workers.dev/price/kusama
// or https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd
type GetPrice = {
  [key: string]: {
    usd: number
  }
}

const whichEndpoint = async (id: string, fallback = false) => {
  if (fallback) {
    return await coingeckoApi('/simple/price', {
      params: {
        ids: id,
        vs_currencies: 'usd',
      },
    })
  }

  // retry to fallback endpoint if error
  return await kodapriceApi(`/price/${id}`, {
    onResponseError({ request, response, options }) {
      console.log('onResponseError', request, response, options)
      getPrice(id, true)
    },
  })
}

export const getPrice = async (
  id: string,
  fallback = false,
): Promise<GetPrice> => {
  try {
    const data = await whichEndpoint(id, fallback)
    return data
  } catch (error) {
    console.log(error)
    return {
      [id]: {
        usd: 0,
      },
    }
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

  console.log('Fetching price from coingecko', id, coinId)

  const data = await getPrice(coinId)

  if (data) {
    const value: number = data[coinId]['usd']
    return value
  }

  return 0
}

export default kodapriceApi
