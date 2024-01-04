import { CollectionWithMeta, NFTWithMeta } from '../rmrk/service/scheme'

export type QueryType = Record<string, unknown>

export type SortType = {
  field: string
  value: -1 | 1
}

export type SortBy = Record<string, number>

export type SearchQuery = {
  search?: string
  type?: string
  sortBy?: string | string[]
  listed: boolean
  owned?: boolean | null
  priceMin?: number
  priceMax?: number
  sortByMultiple?: string[]
}

export type SearchSuggestion = Record<
  string,
  (NFTWithMeta | CollectionWithMeta)[]
>

export type DefaultCollectionSuggestion = {
  id: string
  name: string
  image: string
  nftCount?: number
  owners: number
}
