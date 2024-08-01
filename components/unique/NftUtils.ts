export enum NFTAction {
  SEND = 'SEND',
  CONSUME = 'CONSUME',
  FREEZE = 'FREEZE',
  DELEGATE = 'DELEGATE',
  THAW = 'THAW',
  REVOKE = 'REVOKE',
  NONE = '',
}

export const actionResolver: Record<NFTAction, [string, string]> = {
  'SEND': ['uniques', 'transfer'],
  'CONSUME': ['uniques', 'burn'],
  'DELEGATE': ['uniques', 'approveTransfer'],
  'FREEZE': ['uniques', 'freeze'],
  'THAW': ['uniques', 'thaw'],
  'REVOKE': ['uniques', 'cancelApproval'],
  '': ['', ''],
}

export const basicUpdateFunction = (name: string, index: number): string =>
  `${name} #${index + 1}`
