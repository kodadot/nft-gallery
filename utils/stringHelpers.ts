export const findLongestWord = (str: string): string => {
  const words = str.split(' ')
  return words.reduce((longest, current) => {
    if (current.length > longest.length) {
      return current
    }
    return longest
  }, '')
}
