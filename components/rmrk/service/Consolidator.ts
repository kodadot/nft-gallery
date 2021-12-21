import { RmrkType } from './scheme'
import { RmrkEvent, RmrkInteraction } from '../types'
import { Collection, NFT } from './scheme'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/keyring'

const nftSchema: Record<keyof NFT, boolean> = {
  name: true,
  instance: true,
  transferable: false,
  collection: true,
  sn: true,
  _id: false,
  id: true,
  metadata: false,
  currentOwner: true,
  price: true,
  burned: false,
  emoteCount: false,
  blockNumber: false,
  emotes: false,
  events: false
}

export default class Consolidator {
  public static isPermitedInteraction(): boolean {
    return true
  }

  public static canTransfer(nft: NFT): void  {
    if (!nft.transferable) {
      throw new ValidationError(`NFT ${nft._id} is not transferable`)
    }
  }

  public static isAvailableForSale(nft: NFT, previousOwner: string): boolean  {
    return Consolidator.callerEquals(nft.currentOwner, previousOwner)
  }

  public static consolidate(action: RmrkEvent | string, nft: NFT, previousOwner: string, caller: string): boolean  {
    switch(action) {
    case RmrkEvent.BUY:
      return Consolidator.canBuy(nft, previousOwner)
    case RmrkEvent.CONSUME:
      return Consolidator.canConsume(nft, caller)
    default:
      console.warn(`[CONSOLIDATOR] NO consolidation for interaction ${action}`)
    }

    return true
  }

  private static canBuy(nft: NFT, previousOwner: string) {
    return Consolidator.isAvailableForSale(nft, previousOwner)
  }

  private static canConsume(nft: NFT, caller: string) {
    return Consolidator.callerEquals(nft.currentOwner, caller)
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

  public static collectionIdValid(collection: Collection, caller: string): void  {
    const generatedId = caller.startsWith('0x') ? caller : generateId(
      accountIdToPubKey(caller),
      collection.symbol
    )
    if (!Consolidator.callerEquals(collection._id, generatedId)) {
      throw new ValidationError(
        `Collection id missmatch ${collection._id} vs ${generatedId}`
      )
    }
  }

  public static test(
    rmrk: RmrkType,
    interaction: RmrkInteraction,
    caller: string
  ): boolean {
    return true
  }

  // public static validate() {}

  public static requireCaller(caller = '', interaction: RmrkInteraction): void  {
    if (!caller) {
      throw new ValidationError(
        `Unknown caller, doing ${interaction.toString()}`
      )
    }
  }

  public static isIssuer(collection: Collection, caller = ''): void  {
    if (!Consolidator.callerEquals(collection.issuer, caller)) {
      throw new ValidationError(
        `Caller ${caller} is not issuer of ${collection._id}.\n Issuer is ${collection.issuer}!`
      )
    }
  }

  public static isOwner(nft: NFT, caller = ''): void  {
    if (!Consolidator.callerEquals(nft.currentOwner, caller)) {
      throw new ValidationError(
        `Caller ${caller} is not owner of ${nft._id}.\n Owner is ${nft.currentOwner}!`
      )
    }
  }

  private static callerEquals(ownerId: string, caller: string): boolean {
    return ownerId === caller
  }


  public static nftValid(nft: NFT): void  {
    Object.entries(nft).forEach(([key, value]) => {
      if ((nftSchema as any)[key] && !value) {
        throw new ValidationError(`${key} is missing on NFT ${nft.sn}`)
      }
    })
  }

  public static collectionValid(collection: Collection): void  {
    throw new Error('Not implemented')
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
