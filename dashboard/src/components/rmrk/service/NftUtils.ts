import { hexToString, isHex } from '@polkadot/util';
import { RmrkEvent, RMRK } from '../types';
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

    throw new EvalError('Unable to get action from string');

  }

  public static unwrap(rmrkString: string): any {
    const rr: RegExp = /{.*}/
    const match = rmrkString.match(rr)

    if (match) {
      return JSON.parse(match[0])  
    }

    const split = rmrkString.split(SQUARE)

    if (split.length >= 4) {
      return {
        id: split[3],
        value: split[4]
      }
    }

    throw new TypeError(`RMRK: Unable to unwrap object ${rmrkString}`)
  }

}

class RmrkActionRegex {
  static MINTNFT = /^rmrk::MINTNFT::/;
  static MINT = /^rmrk::MINT::/;
  static SEND = /^rmrk::SEND::/;
  static BUY = /^rmrk::BUY::/;
  static CONSUME = /^rmrk::CONSUME::/;
  static CHANGEISSUER = /^rmrk::CHANGEISSUER::/;
  static LIST = /^rmrk::LIST::/;
  
}



export default NFTUtils
