import useParty from '@/composables/party/useParty'
import { DropEventMintingSession, DropEventType } from './types'
import { useDrop } from '@/components/drops/useDrops'
import useDropMassMintState from '../drop/massmint/useDropMassMintState'

type EventParams = {
  mintingSession?: DropEventMintingSession
  completed?: boolean
}

export default (mintingWatch?: Ref<boolean>[]) => {
  const { drop } = useDrop()
  const { mintingSession, toMintNFTs } = storeToRefs(useDropStore())
  const { canPin } = useDropMassMintState()
  const { sendMessage } = useParty({
    room: computed(() => drop.value?.alias ?? ''),
  })

  const randomGeneration = computed(() => toMintNFTs.value.length > 1)

  const broadastEvent = ({
    mintingSession,
    completed,
    type,
    id,
  }: EventParams & { id?: string; type: DropEventType }) => {
    sendMessage({
      event: { id, type, mintingSession, completed },
    })
  }

  const emitEvent = (
    type: DropEventType,
    { mintingSession, completed = false }: EventParams = {},
  ) => {
    const id = `${type}_${Date.now() * Math.floor(Math.random() * 10)}`

    broadastEvent({
      id,
      type,
      mintingSession,
      completed,
    })
  }

  const completeLastEvent = (type: DropEventType) => {
    broadastEvent({
      type,
      completed: true,
    })
  }

  if (mintingWatch) {
    watch(
      () => toMintNFTs.value.length,
      () => {
        if (randomGeneration.value) {
          emitEvent(DropEventType.DROP_GENERATING)
        }
      },
    )

    watch(canPin, (value) => {
      if (randomGeneration.value && value) {
        completeLastEvent(DropEventType.DROP_GENERATING)
      }
    })

    watch(mintingWatch, (values) => {
      const completed = !values.every(Boolean)
      const hasMintedItems = Boolean(mintingSession.value.items.length)

      if (completed && hasMintedItems) {
        return emitEvent(DropEventType.DROP_MINTED, {
          mintingSession: {
            image: mintingSession.value.items[0].image,
            amount: mintingSession.value.items.length,
          },
        })
      }

      emitEvent(DropEventType.DROP_MINTING, {
        completed,
      })
    })
  }

  return { emitEvent, completeLastEvent }
}
