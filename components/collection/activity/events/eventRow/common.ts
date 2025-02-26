import { Interaction } from '@/utils/shoppingActions'
import { type InteractionWithNFT } from '@/composables/collectionActivity/types'
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
    [Interaction.SEND]: 'bg-background-color',
    SELL: sellColor,
  }[interaction]
}

export const getAmount = (
  event: InteractionWithNFT,
): string | number => {
  switch (event.interaction) {
    case mintInteraction():
      return blank
    case Interaction.LIST:
    case Interaction.BUY:
      return (event as InteractionWithNFT).meta
    default:
      return blank
  }
}

export const getFromAddress = (event: InteractionWithNFT): string => {
  const interaction = event.interaction
  if (interaction === mintInteraction()) {
    return blank
  }
  if (interaction === Interaction.BUY || interaction === Interaction.SEND) {
    return (event as InteractionWithNFT).currentOwner
  }
  if (interaction === Interaction.LIST) {
    return event.caller
  }
  return blank
}

export const getToAddress = (event: InteractionWithNFT): string => {
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
  event: InteractionWithNFT,
): Promise<string> => parseNftAvatar(event.nft)
