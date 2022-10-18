import { NFT } from './scheme'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/keyring'

export default class Consolidator {
  public static isPermitedInteraction(): boolean {
    return true
  }

  public static canTransfer(nft: NFT): void {
    if (!nft.transferable) {
      throw new ValidationError(`NFT ${nft._id} is not transferable`)
    }
  }

  public static isAvailableForSale(nft: NFT, previousOwner: string): boolean {
    return Consolidator.callerEquals(nft.currentOwner, previousOwner)
  }

  // private static canMintNft() {

  // }

  // private static canSend() {

  // }

  // private static canList() {

  // }

  // private static canChangeIssuer() {

  // }

  // public static isValidCollection() {

  // }

  // public static validate() {}

  private static callerEquals(ownerId: string, caller: string): boolean {
    return ownerId === caller
  }
}

function accountIdToPubKey(accountId: string) {
  return (accountId && u8aToHex(decodeAddress(accountId))) || ''
}

export function generateId(caller: string, symbol: string): string {
  if (!caller) {
    return ''
  }

  const pubkey = caller.startsWith('0x') ? caller : accountIdToPubKey(caller)
  return (
    pubkey?.substr(2, 10) +
    pubkey?.substring(pubkey.length - 8) +
    '-' +
    (symbol || '')
  ).toUpperCase()
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
