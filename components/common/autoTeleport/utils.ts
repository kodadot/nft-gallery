import { Interaction } from '@kodadot1/minimark/v1'
import {
  type ActionsInteractions,
  Collections,
} from '@/composables/transaction/types'

export enum ActionlessInteraction {
  FREE_DROP = 'FREE_DROP',
}

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

const interactionMap: {
  [key in AutoTeleportInteractions]?: { action: string; item: string }
} = {
  [Interaction.BUY]: { action: 'purchase', item: 'general.nft' },
  [Interaction.LIST]: { action: 'list', item: 'general.nfts' },
  [Interaction.MINT]: { action: 'create', item: 'collection' },
  [Interaction.MINTNFT]: { action: 'mint', item: 'general.nft' },
  [Interaction.SEND]: { action: 'transfer', item: 'general.nft' },
  [Collections.DELETE]: { action: 'delete', item: 'collection' },
  [Interaction.CONSUME]: { action: 'burn', item: 'general.nft' },
  [ActionlessInteraction.FREE_DROP]: {
    action: 'drops.claimFree',
    item: 'general.nft',
  },
}

const getTransalationKey = (
  interaction: AutoTeleportInteractions,
): { item: string; action: string } => {
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

  const { action, item } = getTransalationKey(interaction)

  const i = interaction.toLocaleLowerCase()

  const title = getTranslation(`autoTeleport.steps.${i}.title`)

  return {
    confirm: getTranslation(`autoTeleport.steps.${i}.confirm`),
    action: getTranslation(action),
    item: getTranslation(item),
    title: title,
    submit: `${title}...`,
  }
}
