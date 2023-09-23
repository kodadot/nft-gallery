export const formatLargeNumber = (number: number, kLimit = 1000) => {
  const formatted =
    number >= kLimit ? (number / 1000).toFixed(1) + 'k' : number.toString()
  return formatted.replace('.0k', 'k')
}
