/**
 * Returns longest word in provided string.
 *
 * @param {string} str String of words
 * @return {string} Longest word in string str
 */
export const findLongestWord = (str: string): string => {
  const words = str.split(' ')
  return words.reduce((longest, current) => {
    if (current.length > longest.length) {
      return current
    }
    return longest
  }, '')
}
