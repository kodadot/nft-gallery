import type { ApiPromise } from '@polkadot/api'
import { correctId } from '@/components/unique/utils'
type CallDictionary = Record<string, [string, string]>

export const uniqueActionResolver: CallDictionary = {
  SEND: ['uniques', 'transfer'],
  CONSUME: ['uniques', 'burn'],
  BUY: ['uniques', 'buyItem'],
  LIST: ['uniques', 'setPrice'],
  // DELEGATE: ['uniques', 'approveTransfer'],
  // FREEZE: ['uniques', 'freeze'],
  // THAW: ['uniques', 'thaw'],
  // REVOKE: ['uniques', 'cancelApproval'],
}

export const nftActionResolver: CallDictionary = {
  SEND: ['nfts', 'transfer'],
  CONSUME: ['nfts', 'burn'],
  BUY: ['nfts', 'buyItem'],
  LIST: ['nfts', 'setPrice'],
  // DELEGATE: ['uniques', 'approveTransfer'],
  // FREEZE: ['uniques', 'freeze'],
  // THAW: ['uniques', 'thaw'],
  // REVOKE: ['uniques', 'cancelApproval'],
}

export const uniqueParamResolver = (
  id: string,
  selectedAction: string,
  meta: string | number,
): any[] => {
  const sanitized = correctId(id)
  const [collectionId, tokenId] = sanitized.split('-')
  const actions = {
    SEND: [collectionId, tokenId, meta],
    CONSUME: [collectionId, tokenId],
    BUY: [collectionId, tokenId, meta],
    LIST: [collectionId, tokenId, meta, undefined],
  }

  return actions[selectedAction]
}

export const nftParamResolver = (
  id: string,
  selectedAction: string,
  meta: string | number,
): any[] => {
  const sanitized = correctId(id)
  const [collectionId, tokenId] = sanitized.split('-')
  const actions = {
    SEND: [collectionId, tokenId, meta],
    CONSUME: [collectionId, tokenId],
    BUY: [collectionId, tokenId, meta],
    LIST: [collectionId, tokenId, meta, undefined],
  }

  return actions[selectedAction]
}

export const assetHubParamResolver = (legacy: boolean) =>
  legacy ? uniqueParamResolver : nftParamResolver

export function getApiCall(
  api: ApiPromise,
  prefix: string,
  selectedAction: string,
  legacy = false,
) {
  const actionResolver = getActionsByPrefix(prefix, legacy)
  const [module, method] =
    actionResolver[selectedAction] || new Error('Action not found')
  return api.tx[module][method]
}

function getActionsByPrefix(prefix: string, legacy = false): CallDictionary {
  switch (prefix) {
    case 'ahk':
    case 'ahp':
      // case 'ahr':
      return legacy ? uniqueActionResolver : nftActionResolver
    default:
      throw new Error('Prefix not found')
  }
}
