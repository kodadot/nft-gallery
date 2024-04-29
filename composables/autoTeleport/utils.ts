import type { ActionList, Actions } from '@/composables/transaction/types'
import { AutoTeleportAction } from './types'
import { Interaction } from '@kodadot1/minimark/v1'
import { teleportExistentialDeposit } from '@kodadot1/static'
import { Chain } from '@/utils/teleport'

export const getChainExistentialDeposit = (
  chain: Chain | undefined | null,
): number => (chain ? teleportExistentialDeposit[chainToPrefixMap[chain]] : 0)

const lengthChanged = <T>(current: T | T[], prev: T | T[]): boolean =>
  Array.isArray(current) && Array.isArray(prev)
    ? current.length !== prev.length
    : !(current && prev)

const checkIfActionNeedsRefetch = (
  action: Actions | undefined,
  prevAction: Actions | undefined,
): boolean => {
  if (!prevAction || !action) {
    return true
  }

  const validityMap: Record<string, (...params: any) => boolean> = {
    [Interaction.LIST]: (curent: ActionList, prev: ActionList) =>
      lengthChanged(curent.token, prev.token),
  }

  const checker = validityMap[action.interaction] || null

  if (!checker) {
    return true
  }

  return checker(action, prevAction)
}

export const checkIfAutoTeleportActionsNeedRefetch = (
  autoTeleportActions: AutoTeleportAction[],
  prevAutoTeleportActions: AutoTeleportAction[] | undefined,
): boolean => {
  if (!prevAutoTeleportActions) {
    return true
  }

  const actions = autoTeleportActions.map(({ action }) => action)
  const prevActions = prevAutoTeleportActions.map(({ action }) => action)

  return actions
    .map((action, index) =>
      checkIfActionNeedsRefetch(action, prevActions[index]),
    )
    .some(Boolean)
}
