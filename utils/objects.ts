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

interface GroupedObject {
  [key: string]: string[]
}

export const groupByNestedProperty = (
  obj: { [key: string]: { [nestedKey: string]: string } },
  nestedKey: string
): GroupedObject => {
  const grouped: GroupedObject = {}

  for (const outerKey in obj) {
    if (isValidProperty(obj[outerKey], nestedKey)) {
      addToGroup(grouped, obj[outerKey][nestedKey], outerKey)
    }
  }

  return grouped
}

const isValidProperty = (
  object: { [key: string]: string },
  key: string
): boolean => {
  return object.hasOwnProperty(key)
}

const addToGroup = (
  grouped: GroupedObject,
  propertyValue: string,
  outerKey: string
): void => {
  if (!grouped[propertyValue]) {
    grouped[propertyValue] = []
  }
  grouped[propertyValue].push(outerKey)
}
