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

export default ({
  room,
  spent,
}: {
  room: Ref<string>
  spent: Ref<number | undefined>
}) => {
  const { x, y, sourceType } = useMouse()
  const { width } = useWindowSize()
  const connections = ref(new Map<string, MaybeUserDetails>())

  const onMessage = (data: CursorPartyEvents) => {
    switch (data.type) {
      case 'sync': {
        const map = new Map()
        for (const [key, value] of Object.entries(data.connections)) {
          map.set(key, value ? getPositionAdujestToWindowSize(value) : null)
        }
        connections.value = map
        break
      }
      case 'update': {
        connections.value.set(
          data.details.id,
          getPositionAdujestToWindowSize(data.details),
        )
        break
      }
      case 'remove':
        connections.value.delete(data.id)
        break
    }
  }

  const { sendMessage: send } = useParty<CursorPartyEvents>({
    room,
    onMessage,
    disabled: computed(() => !usePreferencesStore().getIsPartyMode),
  })

  const cursorConnections = computed(
    () =>
      Object.values(Object.fromEntries(connections.value.entries())).filter(
        Boolean,
      ) as UserDetails[],
  )

  const getPositionAdujestToWindowSize = (
    details: UserDetails,
  ): UserDetails => ({
    ...details,
    cursor: {
      y: details.cursor?.y as number,
      x: (details.cursor?.x || 0) * width.value,
      type: details.cursor?.type,
    },
  })

  const isZeroDot = (connection: UserDetails) =>
    !Number(connection.spent) && connection.spent !== undefined

  const visibleConnections = computed(() => {
    const withPositionFirst = cursorConnections.value.sort(
      (a, b) => Number(b?.cursor?.x) - Number(a?.cursor?.x),
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
      cursor: {
        x: x.value / width.value,
        y: y.value,
        type: sourceType.value,
      },
      spent: spent.value,
    })
  })

  return { connections: visibleConnections }
}
