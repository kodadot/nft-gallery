export type QueryType = Record<string, unknown>

export type SortType = {
  field: string
  value: -1 | 1
}

export type SortBy = Record<string, number>

export type SearchQuery = {
  search: string
  type?: string
  sortBy?: string
  listed: boolean
}
