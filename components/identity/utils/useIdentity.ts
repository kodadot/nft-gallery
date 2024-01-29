import { Interaction } from '@kodadot1/minimark/v2'

export function useIdentitySoldData({ address }) {
  const { nftEntities } = useMinimalEvents({
    interaction: Interaction.BUY,
    where: {
      currentOwner_eq: address,
      nft: {
        currentOwner_not_eq: address,
      },
    },
  })

  return { nftEntities }
}
