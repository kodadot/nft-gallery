import { Interaction } from '@kodadot1/minimark'
import {
  InteractionWithNFT,
  Offer,
  OfferInteraction,
} from '@/components/collection/utils/types'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { mintInteraction } from '@/components/collection/utils/useCollectionActivity/helpers'

export const interactionNameMap = {
  BUY: 'Sale',
  LIST: 'List',
  MINTNFT: 'Mint',
  MINT: 'Mint',
  SEND: 'Transfer',
  Offer: 'Offer',
}
export const blank = '--'

export const getInteractionColor = (interaction: string) =>
  ({
    [mintInteraction()]: 'k-yellow',
    [Interaction.LIST]: 'k-blueaccent',
    [Interaction.BUY]: 'k-pink',
    [OfferInteraction]: 'k-greenaccent',
    [Interaction.SEND]: 'theme-background-color',
  }[interaction])

export const getAmount = (
  event: InteractionWithNFT | Offer
): string | number => {
  switch (event.interaction) {
    case mintInteraction():
      return blank
    case Interaction.LIST:
    case Interaction.BUY:
      return (event as InteractionWithNFT).meta
    case OfferInteraction:
      return (event as Offer).price
    default:
      return blank
  }
}

export const getFromAddress = (event: InteractionWithNFT | Offer): string => {
  const interaction = event.interaction
  if (interaction === mintInteraction() || interaction === Interaction.LIST) {
    return blank
  }
  if (interaction === Interaction.BUY || interaction === Interaction.SEND) {
    return (event as InteractionWithNFT).currentOwner
  }
  if (interaction === OfferInteraction) {
    return (event as Offer).caller
  }
  return blank
}

export const getToAddress = (event: InteractionWithNFT | Offer): string => {
  const interaction = event.interaction
  if (
    interaction === mintInteraction() ||
    interaction === Interaction.LIST ||
    interaction === Interaction.BUY
  ) {
    return event.caller
  }
  if (interaction === Interaction.SEND) {
    return (event as InteractionWithNFT).meta
  }
  return blank
}
export const getNFTAvatar = async (
  event: InteractionWithNFT | Offer
): Promise<string> => {
  if (event.nft.meta?.image) {
    return sanitizeIpfsUrl(event.nft.meta.image)
  } else {
    const meta = (await processSingleMetadata(
      event.nft.metadata
    )) as NFTMetadata
    return sanitizeIpfsUrl(meta?.image)
  }
}
