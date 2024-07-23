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
        audios.value.set((payload as AddPlayerEventPayload).id, { pause: (payload as AddPlayerEventPayload).pause })
        break
      case PlayerEvent.PLAY:
        audios.value.forEach((player: { pause: Pause }, id) => {
          if ((payload as PayloadWithId).id !== id) {
            player.pause().catch(error => error)
          }
        })
        break
      case PlayerEvent.REMOVE_PLAYER:
        audios.value.delete((payload as PayloadWithId).id)
        break
    }
  })

  return { eventBus, unsubscribe }
}
