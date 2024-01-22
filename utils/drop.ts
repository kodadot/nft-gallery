import {
  type DropPhaseConfig,
  PhaseType,
} from '@/components/collection/drop/types'

export const DEFAULT_DROP = {
  alias: 'cpu',
  id: '77',
  chain: 'ahp',
}

export const HOLDER_OF_DROP_MAP = {
  '50': '51',
}

export const DROP_COLLECTION_TO_ALIAS_MAP = {
  '51': 'chroma',
}

export const AHK_GENERATIVE_DROPS = [
  '176', // Chained
]

export const AHP_GENERATIVE_DROPS = [
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

export const DROP_PHASES: Record<string, DropPhaseConfig[]> = {
  flatwhite: [
    {
      name: 'mint.unlockable.privateMint',
      type: PhaseType.HOLDER_OF,
      amount: 512,
    },
    {
      name: 'mint.unlockable.publicMint',
      type: PhaseType.PAID,
      amount: 512,
    },
  ],
}

export const AHP_POPULAR_DROP_COLLECTIONS = [...AHP_GENERATIVE_DROPS]

export const FALLBACK_DROP_COLLECTION_MAX = 300
export const FUTURE_DROP_DATE = new Date(Date.UTC(2024, 0, 18, 16, 0, 0))
