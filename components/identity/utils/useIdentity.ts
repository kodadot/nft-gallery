import { Interaction } from '@kodadot1/minimark/v1'

export function useIdentitySoldData({ address }) {
  const { events, getMinimalNfts, orderMinimalEventsByHighestMeta } =
    useMinimalEvents({
      interaction: Interaction.BUY,
      where: {
        currentOwner_eq: address,
        nft: {
          currentOwner_not_eq: address,
        },
      },
    })

  const nftEntities = computed(() =>
    getMinimalNfts(orderMinimalEventsByHighestMeta(events.value)),
  )

  return { nftEntities }
}
