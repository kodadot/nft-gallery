type Item = { [key: string]: any }

export const getMovedItemToFront = (
  arr: Item[] | any[],
  keyOrValue: string | any,
  value?: any
): (Item | any)[] => {
  let index: number

  if (typeof keyOrValue === 'string' && value !== undefined) {
    index = (arr as Item[]).findIndex((obj) => obj[keyOrValue] === value)
  } else {
    index = (arr as any[]).findIndex((item) => item === keyOrValue)
  }

  if (index === -1) {
    return [...arr]
  }

  const newArr = [...arr]
  const [item] = newArr.splice(index, 1)
  newArr.unshift(item)

  return newArr
}
