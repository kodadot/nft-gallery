import { hexToString, isHex } from '@polkadot/util';
import { RmrkEvent, RMRK, RmrkInteraction } from '../types';
import { SQUARE } from '../utils'

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

  public static decodeAndConvert(rmrkString: string) {
    return NFTUtils.convert(NFTUtils.decodeRmrk(rmrkString))
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
  
}


export default NFTUtils
