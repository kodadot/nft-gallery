import BN from 'bn.js';

export const toNumber = (value: BN | number): number => BN.isBN(value) ? Number(value.toString()) : value || 0;

export const toString = (value: any) => (value && value.toString()) || '';

