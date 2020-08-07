import BN from 'bn.js';
import { Balance } from '@polkadot/types/interfaces';
import { DeriveStakingQuery } from '@polkadot/api-derive/types';
import { BN_ZERO, formatBalance } from '@polkadot/util';

export interface StakingState {
  commission?: string;
  nominators: [string, Balance][];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

const PERBILL_PERCENT = 10_000_000;

export function expandInfo ({ exposure, validatorPrefs }: DeriveStakingQuery): StakingState {
  let nominators: [string, Balance][] = [];
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposure) {
    nominators = exposure.others.map(({ value, who }): [string, Balance] => [who.toString(), value.unwrap()]);
    stakeTotal = exposure.total.unwrap();
    stakeOwn = exposure.own.unwrap();
    stakeOther = stakeTotal.sub(stakeOwn);
  }

  let commission: BN = BN_ZERO

  if (validatorPrefs && validatorPrefs.commission) {
    commission = validatorPrefs.commission.unwrap();
  }

  return {
    commission: commission
      ? `${(commission.toNumber() / PERBILL_PERCENT).toFixed(2)}%`
      : undefined,
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal
  };
}

export function baseBalance (): BN {
  return new BN('1'.padEnd(formatBalance.getDefaults().decimals + 4, '0'));
}
