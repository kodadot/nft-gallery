import { hexToString, isHex } from '@polkadot/util'
import { RmrkEvent, RMRK, RmrkInteraction } from '../types'
import { SQUARE } from '../utils'
import { generateId } from '../service/Consolidator'
import { Collection, NFT, NFTWithMeta, SimpleNFT } from './scheme'
import slugify from 'slugify'
import { RmrkWithMetaType } from './scheme'

export type MintType = {
  collection: Collection
  nfts: NFT[]
}

export type UpdateFunction = (name: string, index: number) => string
export const basicUpdateFunction = (name: string, index: number): string => `${name} #${index + 1}`

class NFTUtils {
  public static decode(value: string): string  {
    return decodeURIComponent(value)
  }

  public static decodeRmrk(rmrkString: string): string {
    return NFTUtils.decode(
      isHex(rmrkString) ? hexToString(rmrkString) : rmrkString
    )
  }

  public static convert(rmrkString: string): RMRK {
    try {
      return {
        event: NFTUtils.getAction(rmrkString),
        view: NFTUtils.unwrap(rmrkString)
      }
    } catch (e) {
      console.warn(e)
      throw e
    }
  }

  public static toString(rmrkType: NFT | Collection, version = '1.0.0'): string {
    if (NFTUtils.isCollection(rmrkType)) {
      return NFTUtils.encodeCollection(rmrkType, version)
    }

    if (NFTUtils.isNFT(rmrkType)) {
      return NFTUtils.encodeNFT(rmrkType, version)
    }

    return ''
  }

  public static encodeCollection(collection: Collection, version: string): string  {
    return `RMRK::MINT::${version}::${encodeURIComponent(
      JSON.stringify(collection)
    )}`
  }

  public static encodeNFT(nft: NFT, version: string): string  {
    return `RMRK::MINTNFT::${version}::${encodeURIComponent(
      JSON.stringify(nft)
    )}`
  }

  public static createInteraction(action: 'SEND' | 'CONSUME' | 'LIST' | 'BUY' | 'EMOTE', version = '1.0.0', objectId: string, meta: string): string  {
    if (!objectId) {
      throw new ReferenceError(`[${action}] Could not create, because nftId`)
    }

    return `RMRK::${action}::${version}::${objectId}${meta ? '::' + meta : ''
    }`
  }


  public static collectionFromNFT(symbol: string, nft: NFT, version = '1.0.0'): Collection {
    return NFTUtils.createCollection(nft.currentOwner, symbol, nft.name, nft.metadata, 1, version)
  }

  public static createCollection(caller: string, symbol: string, name: string, metadata: string, max = 1, version = '1.0.0'): {id: string;
_id: string;
symbol: error;
issuer: string;
version: string;
name: string;
max: number;
metadata: string;
}  {
    const trimmedSymbol = slugify(symbol.trim().toUpperCase(), '_')
    return {
      id: generateId(caller, trimmedSymbol),
      _id: '',
      symbol: trimmedSymbol,
      issuer: caller,
      version,
      name: name.trim(),
      max,
      metadata,
    }
  }

  public static createNFT(caller: string, index: number, collectionId: string, name: string, metadata: string): NFT {
    const instance = NFTUtils.upperTrim(name, true)
    const sn = NFTUtils.nftSerialNumber(index)
    return {
      events: [],
      name: name.trim(),
      instance,
      transferable: 1,
      collection: collectionId,
      sn,
      _id: '',
      id: '',
      metadata,
      currentOwner: caller
    }
  }

  public static createMultipleNFT(max: number, caller: string, collectionId: string, name: string, metadata: string, offset = 0, updateName?: UpdateFunction): NFT[] {
    return Array(max).fill(null).map((_, i) => NFTUtils.createNFT(caller, i + offset, collectionId, updateName ? updateName(name, i) : name, metadata))
  }

  public static upperTrim(name: string, slug?: boolean) {
    const result = name.trim().toUpperCase()
    return slug ? slugify(result, '_') : result
  }

  public static nftSerialNumber(index: number, offset = 0, plusOne = true): string  {
    return String(index + offset + Number(plusOne)).padStart(16, '0')
  }

  public static isCollection(object: Collection | NFT | RmrkWithMetaType): object is Collection {
    return 'issuer' in object && 'symbol' in object
  }

  public static isNFT(object: Collection | NFT | RmrkWithMetaType): object is NFT | NFTWithMeta {
    return 'currentOwner' in object && 'instance' in object
  }

  public static decodeAndConvert(rmrkString: string) {
    return NFTUtils.convert(NFTUtils.decodeRmrk(rmrkString))
  }


  public static generateRemarks(mint: SimpleNFT, caller: string, version = '1.0.0', encode?: boolean, updateName?: UpdateFunction): MintType | string[] {
    const collection = NFTUtils.createCollection(caller, mint.symbol, mint.name, mint.metadata, mint.max, version)
    const nfts = Array(mint.max).fill(null).map((e, i) => NFTUtils.createNFT(caller, i, collection.id, updateName ? updateName(mint.name, i) : mint.name, mint.metadata))

    if (encode) {
      return [NFTUtils.encodeCollection(collection, version), ...nfts.map(nft => NFTUtils.encodeNFT(nft, version))]
    }

    return {
      collection,
      nfts
    }
  }

  public static getAction = (rmrkString: string): RmrkEvent => {
    if (RmrkActionRegex.MINT.test(rmrkString)) {
      return RmrkEvent.MINT
    }

    if (RmrkActionRegex.MINTNFT.test(rmrkString)) {
      return RmrkEvent.MINTNFT
    }

    if (RmrkActionRegex.SEND.test(rmrkString)) {
      return RmrkEvent.SEND
    }

    if (RmrkActionRegex.BUY.test(rmrkString)) {
      return RmrkEvent.BUY
    }

    if (RmrkActionRegex.CONSUME.test(rmrkString)) {
      return RmrkEvent.CONSUME
    }

    if (RmrkActionRegex.CHANGEISSUER.test(rmrkString)) {
      return RmrkEvent.CHANGEISSUER
    }

    if (RmrkActionRegex.LIST.test(rmrkString)) {
      return RmrkEvent.LIST
    }

    if (RmrkActionRegex.EMOTE.test(rmrkString)) {
      return RmrkEvent.EMOTE
    }

    throw new EvalError(`[NFTUtils] Unable to get action from ${rmrkString}`)

  }

  public static unwrap(rmrkString: string): any {
    const rr = /{.*}/
    const match = rmrkString.match(rr)

    if (match) {
      return JSON.parse(match[0])
    }

    const split = rmrkString.split(SQUARE)

    if (split.length >= 4) {
      return ({
        id: split[3],
        metadata: split[4]
      } as RmrkInteraction)
    }

    throw new TypeError(`RMRK: Unable to unwrap object ${rmrkString}`)
  }

}

export class RmrkActionRegex {
  static MINTNFT = /^[rR][mM][rR][kK]::MINTNFT::/
  static MINT = /^[rR][mM][rR][kK]::MINT::/
  static SEND = /^[rR][mM][rR][kK]::SEND::/
  static BUY = /^[rR][mM][rR][kK]::BUY::/
  static CONSUME = /^[rR][mM][rR][kK]::CONSUME::/
  static CHANGEISSUER = /^[rR][mM][rR][kK]::CHANGEISSUER::/
  static LIST = /^[rR][mM][rR][kK]::LIST::/
  static EMOTE = /^[rR][mM][rR][kK]::EMOTE::/

}


export default NFTUtils
