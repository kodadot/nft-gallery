import useParty from '@/composables/party/useParty'
import { DropEventType } from './types'

type EventParams = { image?: string; completed?: boolean }

export default (drop: string, mintingWatch: Ref<boolean>[]) => {
  const { sendMessage } = useParty({ room: computed(() => drop) })

  const broadastEvent = ({
    image,
    completed,
    type,
    id,
  }: EventParams & { id?: string; type: DropEventType }) => {
    sendMessage({
      event: { id, type, image, completed },
    })
  }

  const emitEvent = (
    type: DropEventType,
    { image, completed = false }: EventParams = {},
  ) => {
    const id = `${type}_${Date.now() * Math.floor(Math.random() * 10)}`

    broadastEvent({
      id,
      type,
      image,
      completed,
    })
  }

  const completeLastEvent = (type: DropEventType) => {
    broadastEvent({
      type,
      completed: true,
    })
  }

  watch(mintingWatch, (values) => {
    emitEvent(DropEventType.DROP_MINTING, {
      completed: !values.every(Boolean),
    })
  })

  return { emitEvent, completeLastEvent }
}
