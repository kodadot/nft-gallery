import { $fetch } from 'ofetch'

const COINGECKO_BASE_URL = '/coingecko'
const KRAKEN_BASE_URL = '/kraken'
const BINANCE_BASE_URL = '/binance'

function createApi(url: string) {
  return $fetch.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'omit',
  })
}

const coingeckoApi = createApi(COINGECKO_BASE_URL)
const krakenApi = createApi(KRAKEN_BASE_URL)
const binanceApi = createApi(BINANCE_BASE_URL)

const tokenMap = {
  KSM: 'kusama',
  DOT: 'polkadot',
  BSX: 'basilisk',
} as const

export type Token = keyof typeof tokenMap
type TokenValue = (typeof tokenMap)[Token]

type CoingeckoPrice = Partial<{
  [key in TokenValue]: {
    usd: number
  }
}>

type KrakenPrice = {
  error: string[]
  result: {
    [token in Token as `${token}USD`]: {
      a: [string, string, string]
    }
  }
}

type BinancePrice = {
  mins: number
  price: string
}

function toFloat(str: string) {
  return parseFloat(Number(str).toFixed(2))
}

async function getPriceWithFallbacks(
  token: Token,
): Promise<CoingeckoPrice | undefined> {
  try {
    const price = await coingeckoApi<CoingeckoPrice>('/api/v3/simple/price', {
      params: {
        ids: tokenMap[token],
        vs_currencies: 'usd',
      },
    })
    return price
  } catch (__) {}

  try {
    const price = await krakenApi<KrakenPrice>('/0/public/Ticker', {
      params: {
        pair: `${token}USD`,
      },
    })

    return {
      [tokenMap[token]]: {
        usd: toFloat(price.result[`${token}USD`].a[0]),
      },
    }
  } catch (__) {}

  try {
    const price = await binanceApi<BinancePrice>('/api/v3/avgPrice', {
      params: {
        symbol: `${token}USDT`,
      },
    })

    return {
      [tokenMap[token]]: {
        usd: toFloat(price.price),
      },
    }
  } catch (error) {
    console.error('Price fetching error:', error)
  }
}

export async function getPrice(
  token: Token,
  returnType: 'number',
): Promise<number>
export async function getPrice(
  token: Token,
  returnType: 'object',
): Promise<CoingeckoPrice>

export async function getPrice(token: Token, returnType: 'number' | 'object') {
  let price = await getPriceWithFallbacks(token)
  const tokenValue = tokenMap[token]

  if (!price) {
    const stored = JSON.parse(localStorage.getItem(token) || '0')

    price = {
      [tokenValue]: {
        usd: toFloat(stored),
      },
    }
  } else {
    localStorage.setItem(token, price[tokenValue]!.usd.toString())
  }

  if (returnType === 'number') {
    return price[tokenValue]!.usd
  }

  return price
}
