export const DEFAULT_DROP = {
  alias: 'refraction',
  id: '106',
  chain: 'ahp',
}

export const HOLDER_OF_DROP_MAP = {
  '50': '51',
  '352': '377',
  '77': '95',
}

export const DROP_COLLECTION_TO_ALIAS_MAP = {
  '51': 'chroma',
  '377': 'complexity',
  '95': 'echo',
}

export const AHK_GENERATIVE_DROPS = [
  '176', // Chained
]

export const AHP_GENERATIVE_DROPS = [
  '87', // Florist
  '82', // Alchemy
  '77', // Chained
  '76', // Assemblies
  '66', // Split
  '63', // Genera
  '60', // Christmas City
  '52', // Whirls
  '51', // Chroma
  '50', // .motherboard
  '49', // wallstreet
  '46', // Snowflakes
  '40', // Swirls
  '38', // Generativ Art - Pare1d0scope
]

export const AHP_POPULAR_DROP_COLLECTIONS = [...AHP_GENERATIVE_DROPS]

export const FALLBACK_DROP_COLLECTION_MAX = 300
export const FUTURE_DROP_DATE = new Date(Date.UTC(2024, 0, 25, 14, 0, 0))

export const generateRandomEmail = () => {
  const crypto = window.crypto
  const array = new Uint32Array(1)
  return `${crypto.getRandomValues(array).toString()}@example.com`
}
