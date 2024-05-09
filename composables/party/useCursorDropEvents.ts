import useParty from '@/composables/party/useParty'
import { DropEventMintingSession, DropEventType } from './types'
import { useDrop } from '@/components/drops/useDrops'
import useDropMassMintState from '../drop/massmint/useDropMassMintState'
import useGenerativeDropMint from '../drop/useGenerativeDropMint'

type EventParams = {
  mintingSession?: DropEventMintingSession
  completed?: boolean
}

export default (
  mintingWatch?: Ref<boolean>[],
  { massmint = true }: { massmint?: boolean } = {},
) => {
  const { drop } = useDrop()
  const { mintingSession, toMintNFTs } = storeToRefs(useDropStore())
  const { claimedNft } = useGenerativeDropMint()
  const { canPin, canMint } = useDropMassMintState()
  const { sendMessage } = useParty({
    room: computed(() => drop.value?.alias ?? ''),
    disabled: computed(() => !usePreferencesStore().getIsPartyMode),
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

  if (mintingWatch && massmint) {
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
  }

  if (mintingWatch) {
    watch(mintingWatch, (values) => {
      const completed = !values.every(Boolean)
      const hasMintedItems = massmint
        ? Boolean(mintingSession.value.items.length)
        : Boolean(claimedNft.value?.image)

      if (completed && hasMintedItems) {
        const image = massmint
          ? mintingSession.value.items[0].image
          : (claimedNft.value?.image as string)

        const amount = massmint ? mintingSession.value.items.length : 1

        return emitEvent(DropEventType.DROP_MINTED, {
          mintingSession: {
            image,
            amount,
          },
        })
      }

      const emitDropMinting = massmint ? canMint.value : true

      if (emitDropMinting) {
        emitEvent(DropEventType.DROP_MINTING, {
          completed,
        })
      }
    })
  }

  return { emitEvent, completeLastEvent }
}
