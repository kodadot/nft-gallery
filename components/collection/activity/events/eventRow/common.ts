import { Interaction } from '@kodadot1/minimark/v1'
import {
  InteractionWithNFT,
  Offer,
  OfferInteraction,
} from '@/composables/collectionActivity/types'
import { parseNftAvatar } from '@/utils/nft'
import { mintInteraction } from '@/composables/collectionActivity/helpers'

export type MappingOptions = {
  distinguishBuyAndSell?: boolean
}

const defaultMappingOptions: MappingOptions = {
  distinguishBuyAndSell: false,
}

export const interactionNameMap = ({
  distinguishBuyAndSell,
}: MappingOptions = defaultMappingOptions) => {
  const map = {
    LIST: 'List',
    MINTNFT: 'Mint',
    MINT: 'Mint',
    SEND: 'Transfer',
    Offer: 'Offer',
  }

  if (distinguishBuyAndSell) {
    return { ...map, BUY: 'Buy', SELL: 'Sale' }
  }
  return { ...map, BUY: 'Sale' }
}
export const blank = '--'

export const getInteractionColor = (
  interaction: string,
  { distinguishBuyAndSell }: MappingOptions = defaultMappingOptions,
) => {
  const sellColor = 'bg-k-pink'
  const buyColor = 'bg-k-aqua-blue'
  return {
    [mintInteraction()]: 'bg-k-yellow',
    [Interaction.LIST]: 'bg-k-blue-accent',
    [Interaction.BUY]: distinguishBuyAndSell ? buyColor : sellColor,
    [OfferInteraction]: 'bg-k-green-accent',
    [Interaction.SEND]: 'bg-background-color',
    SELL: sellColor,
  }[interaction]
}

export const getAmount = (
  event: InteractionWithNFT | Offer,
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
  if (interaction === mintInteraction()) {
    return blank
  }
  if (interaction === Interaction.BUY || interaction === Interaction.SEND) {
    return (event as InteractionWithNFT).currentOwner
  }
  if (interaction === OfferInteraction || interaction === Interaction.LIST) {
    return (event as Offer).caller
  }
  return blank
}

export const getToAddress = (event: InteractionWithNFT | Offer): string => {
  const interaction = event.interaction
  if (interaction === mintInteraction() || interaction === Interaction.BUY) {
    return event.caller
  }
  if (interaction === Interaction.SEND) {
    return (event as InteractionWithNFT).meta
  }
  return blank
}
export const getNFTAvatar = (
  event: InteractionWithNFT | Offer,
): Promise<string> => parseNftAvatar(event.nft)
