import PartySocket from 'partysocket'

type UsePartyParams<T> = {
  room: Ref<string>
  onMessage?: (value: T) => void
}

const PARTY_SOCKET_HOST = 'https://my-party.hassnian.partykit.dev/'

export default <T>({ room, onMessage }: UsePartyParams<T>) => {
  const { accountId } = useAuth()
  const ws = ref<PartySocket>()
  const connected = ref(false)

  const connect = (room: string) => {
    ws.value = new PartySocket({
      host: PARTY_SOCKET_HOST,
      room: room,
      id: accountId.value,
    })

    ws.value.addEventListener('open', () => {
      console.log('[PARTY:OPEN] Connection established 🎉')
      connected.value = true
    })

    ws.value.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (onMessage) {
        onMessage(data)
      }
    })
  }

  const sendMessage = (value: any) => {
    ws.value?.send(JSON.stringify(value))
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

  onBeforeUnmount(() => ws.value?.close())

  return { sendMessage, open: connected }
}
