export type QueryType = Record<string, unknown>

export type SortBy = Record<string, number>;

export type SearchQuery = {
  query: string;
  type?: string;
  sortBy?: SortBy;
}

