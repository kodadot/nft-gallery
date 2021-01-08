import { hexToString, isHex } from '@polkadot/util';
import { RmrkEvent, RMRK } from '../types';

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

    throw new EvalError('Unable to get action from string');

  }

  public static unwrap(rmrkString: string): any {
    const rr: RegExp = /{.*}/
    const match = rmrkString.match(rr)

    if (!match) {
      throw new TypeError(`RMRK: Unable to unwrap object ${rmrkString}`)
    }

    return JSON.parse(match[0])

  }


}

class RmrkActionRegex {
  static MINTNFT = /^rmrk::MINTNFT::/;
  static MINT = /^rmrk::MINT::/;
  static SEND = /^rmrk::SEND::/;
}


export default NFTUtils
