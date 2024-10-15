type Item = { [key: string]: unknown }

export const getMovedItemToFront = (
  arr: Item[] | [],
  keyOrValue: string,
  value?: string,
): (Item)[] => {
  let index: number

  if (typeof keyOrValue === 'string' && value !== undefined) {
    index = (arr as Item[]).findIndex(obj => obj[keyOrValue] === value)
  }
  else {
    index = (arr as []).findIndex(item => item === keyOrValue)
  }

  if (index === -1) {
    return [...arr]
  }

  const newArr = [...arr]
  const [item] = newArr.splice(index, 1)
  newArr.unshift(item)

  return newArr
}
