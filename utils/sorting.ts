import { Interaction } from '~/components/rmrk/service/scheme'

// Sort events by Timestamp
export const sortedEventByDate = (
  events: Interaction[],
  order = 'ASC'
): Interaction[] => {
  if (events.length == 0) {
    return events
  }

  if (order == 'DESC') {
    events.sort((a: Interaction, b: Interaction) =>
      a.timestamp > b.timestamp ? 0 : -1
    )
  } else {
    events.sort((a: Interaction, b: Interaction) =>
      a.timestamp > b.timestamp ? -1 : 0
    )
  }
  return events
}

export const sortItemListByIds = (
  itemList: { id: string }[],
  ids: string[],
  limit = 10
) => {
  let count = 0
  const dataMap = new Map(itemList.map((item) => [item.id, item]))
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
