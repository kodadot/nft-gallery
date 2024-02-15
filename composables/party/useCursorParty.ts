import useParty from '@/composables/party/useParty'
import { RemoveMessage, SyncMessage, UpdateMessage, UserDetails } from './types'

type CursorPartyEvents = UpdateMessage | RemoveMessage | SyncMessage

export default ({ room, spent }: { room: Ref<string>; spent: Ref<number> }) => {
  const THROTTLE_AMOUNT_MESSAGE = 100

  const { x, y, sourceType } = useMouse()
  const { width } = useWindowSize()
  const connections = ref<UserDetails[]>([])

  const onMessage = (data: CursorPartyEvents) => {
    switch (data.type) {
      case 'sync':
        connections.value = data.connections
        break
      case 'update':
        const has = connections.value.find(
          (connection) => connection.id === data.details.id,
        )
        const newValue = { ...data.details, x: data.details.x * width.value }

        if (!has) {
          connections.value.push(newValue)
        } else {
          connections.value = connections.value.map((connection) => {
            if (connection.id === data.details.id) {
              return newValue
            }
            return connection
          })
        }
        break
      case 'remove':
        connections.value = connections.value.filter(
          (connection) => connection.id !== data.id,
        )
        break
    }
  }

  const { sendMessage: send } = useParty<CursorPartyEvents>({ room, onMessage })
  const sendMessage = useThrottleFn(send, THROTTLE_AMOUNT_MESSAGE)

  watchEffect(() => {
    sendMessage({
      x: x.value / width.value,
      y: y.value,
      cursor: sourceType.value,
      spent: spent.value,
    })
  })

  return { connections }
}
