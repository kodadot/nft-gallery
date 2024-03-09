import useParty from '@/composables/party/useParty'
import { DropEventType } from './types'
import useGenerativeDropMint from '../drop/useGenerativeDropMint'
import { useDrop } from '@/components/drops/useDrops'

type EventParams = { image?: string; completed?: boolean }

export default (mintingWatch?: Ref<boolean>[]) => {
  const { drop } = useDrop()
  const { mintedNft } = useGenerativeDropMint()
  const { sendMessage } = useParty({
    room: computed(() => drop.value?.alias ?? ''),
  })

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

  if (mintingWatch && mintedNft) {
    watch(mintingWatch, (values) => {
      const completed = !values.every(Boolean)
      const image = mintedNft.value?.image

      if (completed && image) {
        return preloadImage(image).finally(() =>
          emitEvent(DropEventType.DROP_MINTED, { image }),
        )
      }

      emitEvent(DropEventType.DROP_MINTING, {
        completed,
      })
    })
  }

  return { emitEvent, completeLastEvent }
}
