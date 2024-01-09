export function getExpiration(currentBlock: number, dayCount: number): number {
  const BLOCK_OFFSET = 5 // time between submit & finalization
  const BLOCK_PER_DAY_COUNT = 7200 // 7200 = 86400 / 12
  const DAY_COUNT = dayCount

  return currentBlock + BLOCK_OFFSET + BLOCK_PER_DAY_COUNT * DAY_COUNT
}
