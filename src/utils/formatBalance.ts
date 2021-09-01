import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';

function format(balance: number | string | BN | bigint, decimals: number = 12, withUnit?: boolean | string, withSi?: boolean ) {
  try {
    return formatBalance(balance, { decimals , withUnit , forceUnit: '-', withSi })
  } catch (e: any) {
    console.error('[FORMAT BALANCE]', e.message, String(balance), typeof balance, decimals, withUnit)
    return ''
  }

}

export function calculateBalance(value: number, decimals: number = 12) {
  return value * Math.pow(10, decimals)
}

export default format
