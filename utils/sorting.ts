export const sortItemListByIds = (
  itemList: { id: string }[],
  ids: string[],
  limit = 10,
) => {
  let count = 0
  const dataMap = new Map(itemList.map(item => [item.id, item]))
  const sortedList: { id: string }[] = []

  for (let i = 0; i < ids.length && count < limit; i++) {
    const item = dataMap.get(ids[i])
    if (item) {
      sortedList.push(item)
      count += 1
    }
  }
  return sortedList
}
