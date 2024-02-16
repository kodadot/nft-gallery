import useParty from '@/composables/party/useParty'
import {
  MaybeUserDetails,
  RemoveMessage,
  SyncMessage,
  UpdateMessage,
  UserDetails,
} from './types'
import filter from 'lodash/filter'

type CursorPartyEvents = UpdateMessage | RemoveMessage | SyncMessage

const ZERO_DOT_VISIBLE_CURSOR_AMOUNT = 10
const THROTTLE_AMOUNT_MESSAGE_UPDATE = 100 // ms

export default ({ room, spent }: { room: Ref<string>; spent: Ref<number> }) => {
  const { x, y, sourceType } = useMouse()
  const { width } = useWindowSize()
  const connections = ref(new Map<string, MaybeUserDetails>())

  const onMessage = (data: CursorPartyEvents) => {
    switch (data.type) {
      case 'sync':
        connections.value = new Map(Object.entries(data.connections))
        break
      case 'update': {
        connections.value.set(data.details.id, {
          ...data.details,
          x: data.details.x * width.value,
        })
        break
      }
      case 'remove':
        connections.value.delete(data.id)
        break
    }
  }

  const { sendMessage: send } = useParty<CursorPartyEvents>({ room, onMessage })

  const cursorConnections = computed(
    () =>
      Object.values(Object.fromEntries(connections.value.entries())).filter(
        Boolean,
      ) as UserDetails[],
  )

  const isZeroDot = (connection: UserDetails) => !Number(connection.spent)

  const visibleConnections = computed(() => {
    const withPositionFirst = cursorConnections.value.sort(
      (a, b) => Number(b?.x) - Number(a?.x),
    )
    const someZeroDotCursors = filter(withPositionFirst, (connection) =>
      isZeroDot(connection),
    ).slice(0, ZERO_DOT_VISIBLE_CURSOR_AMOUNT)
    const othersCursors = filter(
      cursorConnections.value,
      (connection) => !isZeroDot(connection),
    )
    return [...someZeroDotCursors, ...othersCursors]
  })

  const sendMessage = useThrottleFn(send, THROTTLE_AMOUNT_MESSAGE_UPDATE)

  watchEffect(() => {
    sendMessage({
      x: x.value / width.value,
      y: y.value,
      cursor: sourceType.value,
      spent: spent.value,
    })
  })

  return { connections: visibleConnections }
}
