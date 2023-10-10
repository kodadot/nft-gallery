import { useEventBus } from '@vueuse/core'

type Pause = () => Promise<any>

type PayloadWithId = {
  id: number
}

type AddPlayerEventPayload = {
  pause: Pause
} & PayloadWithId

export enum PlayerEvent {
  PLAY,
  ADD_PLAYER,
  REMOVE_PLAYER,
}

const audios = ref(new Map())

export function usePlayerEventBus() {
  const eventBus = useEventBus<
    PlayerEvent,
    AddPlayerEventPayload | PayloadWithId
  >('player')

  const unsubscribe = eventBus.on((event, payload) => {
    switch (event) {
      case PlayerEvent.ADD_PLAYER:
        const addPlayerPayload = payload as AddPlayerEventPayload
        audios.value.set(addPlayerPayload.id, { pause: addPlayerPayload.pause })
        break
      case PlayerEvent.PLAY:
        const playPlayerEventPayload = payload as PayloadWithId
        audios.value.forEach((player: { pause: Pause }, id) => {
          if (playPlayerEventPayload.id !== id) {
            player.pause().catch((error) => error)
          }
        })
        break
      case PlayerEvent.REMOVE_PLAYER:
        const removePlayerEventPayload = payload as PayloadWithId
        audios.value.delete(removePlayerEventPayload.id)
        break
    }
  })

  return { eventBus, unsubscribe }
}
