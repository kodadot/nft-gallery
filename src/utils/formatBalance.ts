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

// Legacy
// const format = (balance: Compact<any> | BN | string, currency: string, withSi?: boolean): string => {
//   const value = typeof balance === 'object' ? balance.toString() : balance;

//   const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');
//   // console.log(`${prefix}.${`000${postfix || ''}`.slice(-3)} ${currency}`);

//   const isShort = withSi && prefix.length >= K_LENGTH;

//   if (prefix.length > M_LENGTH) {
//     return `${formatBalance(value.substring(0, value.length-12)).replace('Unit','')} ${currency}`;
//   }

//   return `${!isShort && value ? prefix : '0'}.000${''.slice(-3) } ${currency}`

// }

export default format
