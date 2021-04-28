import { hexToString, isHex } from '@polkadot/util';
import { RmrkEvent, RMRK, RmrkInteraction } from '../types';
import { SQUARE } from '../utils'
import { generateId } from '../service/Consolidator'
import { Collection, NFT, SimpleNFT } from './scheme';
import slugify from 'slugify';

class NFTUtils {
  public static decode(value: string) {
    return decodeURIComponent(value);
  }

  public static decodeRmrk(rmrkString: string): string {
    return NFTUtils.decode(
      isHex(rmrkString) ? hexToString(rmrkString) : rmrkString
    );
  }

  public static convert(rmrkString: string): RMRK {
    try {
      return {
        event: NFTUtils.getAction(rmrkString),
        view: NFTUtils.unwrap(rmrkString)
      }
    } catch(e) {
      throw e
    }
  }

  public static toString(rmrkType: NFT | Collection, version: string = 'RMRK1.0.0'): string {
    if (NFTUtils.isCollection(rmrkType)) {
      return NFTUtils.encodeCollection(rmrkType, version)
    }

    if (NFTUtils.isNFT(rmrkType)) {
      return NFTUtils.encodeNFT(rmrkType, version)
    }

    return ''
  }

  public static encodeCollection(collection: Collection, version: string) {
    return `RMRK::MINT::${version}::${encodeURIComponent(
      JSON.stringify(collection)
    )}`;
  }

  protected static encodeNFT(nft: NFT, version: string) {
    return `RMRK::MINTNFT::${version}::${encodeURIComponent(
      JSON.stringify(nft)
    )}`
  }

  public static collectionFromNFT(symbol: string, nft: NFT, version: string = '1.0.0'): Collection {
    return NFTUtils.createCollection(nft.currentOwner, symbol, nft.name, nft.metadata, 1, version)
  }

  public static createCollection(caller: string, symbol: string, name: string, metadata: string, max: number = 1, version: string = '1.0.0') {
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

  public static isCollection(object: Collection | NFT): object is Collection {
    return 'issuer' in object && 'symbol' in object;
  }

  public static isNFT(object: Collection | NFT): object is NFT {
    return 'currentOwner' in object && 'instance' in object;
  }

  public static decodeAndConvert(rmrkString: string) {
    return NFTUtils.convert(NFTUtils.decodeRmrk(rmrkString))
  }

  public static generateRemarks(simpleMint: SimpleNFT, caller: string, encode?: boolean): (Collection | NFT)[] | string[] {
    const collection = NFTUtils.createCollection(nft.currentOwner, symbol, nft.name, nft.metadata, 1, version)
  }

  public static getAction = (rmrkString: string): RmrkEvent  => {
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

    throw new EvalError(`[NFTUtils] Unable to get action from ${rmrkString}`);

  }

  public static unwrap(rmrkString: string): any {
    const rr: RegExp = /{.*}/
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

class RmrkActionRegex {
  static MINTNFT = /^[rR][mM][rR][kK]::MINTNFT::/;
  static MINT = /^[rR][mM][rR][kK]::MINT::/;
  static SEND = /^[rR][mM][rR][kK]::SEND::/;
  static BUY = /^[rR][mM][rR][kK]::BUY::/;
  static CONSUME = /^[rR][mM][rR][kK]::CONSUME::/;
  static CHANGEISSUER = /^[rR][mM][rR][kK]::CHANGEISSUER::/;
  static LIST = /^[rR][mM][rR][kK]::LIST::/;
  static EMOTE = /^[rR][mM][rR][kK]::EMOTE::/;

}


export default NFTUtils
