import BN from 'bn.js';

export const toNumber = (value: BN | number): number => BN.isBN(value) ? value.toNumber() : value || 0;
