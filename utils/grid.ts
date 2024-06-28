export const shouldLazyLoad = ({
  index,
  cols,
  limit,
  skipRows,
}: {
  index: number
  cols: number
  limit: number
  skipRows: number
}): boolean => {
  const batchIndex = Math.floor(index / limit)

  const batchStartIndex = batchIndex * limit

  return !(
    index >= batchStartIndex && index < batchStartIndex + cols * skipRows
  )
}
