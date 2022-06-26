export function countOf(value: DataWithCount) {
  return value.count || value.totalCount
}

export type DataWithCount = {
  totalCount?: number
  count?: number
}
