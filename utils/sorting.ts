import { Interaction } from '~/components/rmrk/service/scheme'

// Sort events by Timestamp
export const sortedEventByDate = (
  events: Interaction[],
  order = 'DESC'
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
