import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/keyring'

function accountIdToPubKey(accountId: string) {
  return (accountId && u8aToHex(decodeAddress(accountId))) || ''
}

export function generateId(caller: string, symbol: string): string {
  if (!caller) {
    return ''
  }

  const pubkey = caller.startsWith('0x') ? caller : accountIdToPubKey(caller)
  return (
    pubkey?.substr(2, 10)
    + pubkey?.substring(pubkey.length - 8)
    + '-'
    + (symbol || '')
  ).toUpperCase()
}
