import PartySocket from 'partysocket'

type UsePartyParams<T> = {
  room: Ref<string>
  onMessage?: (value: T) => void
}

const PARTY_SOCKET_HOST = 'https://partykit.kodadot.workers.dev/'
const wss = ref(new Map<string, PartySocket>())

export default <T>({ room, onMessage }: UsePartyParams<T>) => {
  const { accountId } = useAuth()

  const connect = (room: string) => {
    console.log(`[PARTY::CONNECTION] Establishing connection with room ${room}`)

    if (wss.value.has(room)) {
      console.log(
        `[PARTY::CONNECTION] Connection with room ${room} already established ✅`,
      )
      attachMessageListener(wss.value.get(room) as PartySocket)
      return
    }

    const ws = new PartySocket({
      host: PARTY_SOCKET_HOST,
      room: room,
      id: accountId.value,
    })

    ws.addEventListener('open', () => {
      console.log('[PARTY::CONNECTION] Connection established 🎉')
    })

    ws.addEventListener('error', (error) => {
      console.log(
        `[PARTY::CONNECTION] Connection with room ${room} failed ❗️`,
        error,
      )
    })

    attachMessageListener(ws)

    wss.value.set(room, ws)
  }

  const attachMessageListener = (ws: PartySocket) => {
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (onMessage) {
        onMessage(data)
      }
    })
  }

  const sendMessage = (value: any) => {
    wss.value.get(room.value)?.send(JSON.stringify(value))
  }

  watch(
    room,
    (value) => {
      if (value) {
        connect(value)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    for (const [room, ws] of wss.value) {
      console.log(`[PARTY::CONNECTION] Closing connection with room ${room}`)
      ws.close()
      wss.value.delete(room)
    }
  })

  return { sendMessage }
}
