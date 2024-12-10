import { Interaction } from '@kodadot1/static'
import {
  type ActionsInteractions,
  Collections,
} from '@/composables/transaction/types'
import { NFTs } from '@/composables/transaction/types'

export type ActionlessInteraction = NFTs.MINT_DROP

export type AutoTeleportInteractions =
  | ActionsInteractions
  | ActionlessInteraction

type AutoTeleportStepDetails = {
  confirm: string
  action: string
  item: string
  title: string
  submit: string
}

const interactionMap: Partial<Record<AutoTeleportInteractions, { action: string, item: string, overrideInteraction?: string }>> = {
  [Interaction.BUY]: { action: 'purchase', item: 'general.nft' },
  [Interaction.LIST]: { action: 'list', item: 'general.nfts' },
  [Interaction.CREATE]: { action: 'create', item: 'collection' },
  [Interaction.MINTNFT]: { action: 'mint', item: 'general.nft' },
  [Interaction.SEND]: { action: 'transfer', item: 'general.nft' },
  [Collections.DELETE]: { action: 'delete', item: 'collection' },
  [Interaction.BURN]: { action: 'burn', item: 'general.nft' },
}

const overrideInteractionMap: Partial<Record<AutoTeleportInteractions, AutoTeleportInteractions>> = {
  [NFTs.MINT_DROP]: Interaction.MINTNFT,
}

const getMappedInteraction = (interaction: AutoTeleportInteractions): AutoTeleportInteractions => {
  const overrideInteraction = overrideInteractionMap[interaction]

  return overrideInteraction || interaction
}

const getTranslationKey = (
  interaction: AutoTeleportInteractions,
): { item: string, action: string } => {
  const { action, item } = interactionMap[interaction] || {
    action: '',
    item: '',
  }

  return {
    action,
    item,
  }
}

export const getActionDetails = (
  interaction: AutoTeleportInteractions,
): AutoTeleportStepDetails => {
  const { $i18n } = useNuxtApp()
  const getTranslation = (key: string) => $i18n.t(key) || ''

  const mappedInteraction = getMappedInteraction(interaction)

  const { action, item } = getTranslationKey(mappedInteraction)

  const i = mappedInteraction.toLocaleLowerCase()

  const title = getTranslation(`autoTeleport.steps.${i}.title`)

  return {
    confirm: getTranslation(`autoTeleport.steps.${i}.confirm`),
    action: getTranslation(action),
    item: getTranslation(item),
    title: title,
    submit: `${title}...`,
  }
}
