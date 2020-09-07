import { DeriveStakerReward } from '@polkadot/api-derive/types';
import { EraIndex } from '@polkadot/types/interfaces';
import { PayoutStash, PayoutValidator } from './types';
import Connector from '@vue-polkadot/vue-api'

import BN from 'bn.js';
import { BN_ZERO } from '@polkadot/util';
import { Option } from '@polkadot/types';
import { isFunction } from '@polkadot/util';

export interface Available {
  stashTotal?: BN | null;
  stashes?: PayoutStash[];
  validators?: PayoutValidator[];
}

export interface EraSelection {
  value: number;
  text: string;
}

const DAY_SECS = new BN(1000 * 60 * 60 * 24);

export function groupByValidator (allRewards: Record<string, DeriveStakerReward[]>, stakerPayoutsAfter: BN): PayoutValidator[] {
  return Object
    .entries(allRewards)
    .reduce((grouped: PayoutValidator[], [stashId, rewards]): PayoutValidator[] => {
      rewards
        .filter(({ era }) => era.gte(stakerPayoutsAfter))
        .forEach((reward): void => {
          Object
            .entries(reward.validators)
            .forEach(([validatorId, { value }]): void => {
              const entry = grouped.find((entry) => entry.validatorId === validatorId);

              if (entry) {
                const eraEntry = entry.eras.find((entry) => entry.era.eq(reward.era));

                if (eraEntry) {
                  eraEntry.stashes[stashId] = value;
                } else {
                  entry.eras.push({
                    era: reward.era,
                    stashes: { [stashId]: value }
                  });
                }

                entry.available = entry.available.add(value);
              } else {
                grouped.push({
                  available: value,
                  eras: [{
                    era: reward.era,
                    stashes: { [stashId]: value }
                  }],
                  validatorId
                });
              }
            });
        });

      return grouped;
    }, [])
    .sort((a, b) => b.available.cmp(a.available));
}

export function extractStashes (allRewards: Record<string, DeriveStakerReward[]>): PayoutStash[] {
  return Object
    .entries(allRewards)
    .map(([stashId, rewards]): PayoutStash => ({
      available: rewards.reduce((result, { validators }) =>
        Object.values(validators).reduce((result, { value }) =>
          result.iadd(value), result), new BN(0)
      ),
      rewards,
      stashId
    }))
    .filter(({ available }) => !available.isZero())
    .sort((a, b) => b.available.cmp(a.available));
}

export function getAvailable (allRewards: Record<string, DeriveStakerReward[]> | null | undefined, stakerPayoutsAfter: BN): Available {
  if (allRewards) {
    const stashes = extractStashes(allRewards);
    const stashTotal = stashes.length
      ? stashes.reduce((total: BN, { available }) => total.add(available), BN_ZERO)
      : null;

    return {
      stashTotal,
      stashes,
      validators: groupByValidator(allRewards, stakerPayoutsAfter)
    };
  }

  return {};
}

export function getOptions (eraLength: BN | undefined, historyDepth: BN | undefined): EraSelection[] {
  if (eraLength && historyDepth) {
    const { api } = Connector.getInstance();
    const blocksPerDay = DAY_SECS.div(api.consts.babe?.expectedBlockTime || api.consts.timestamp?.minimumPeriod.muln(2) || new BN(6000));
    const maxBlocks = eraLength.mul(historyDepth);
    const eraSelection: EraSelection[] = [];
    let days = 2;

    while (true) {
      const dayBlocks = blocksPerDay.muln(days);

      if (dayBlocks.gte(maxBlocks)) {
        break;
      }

      eraSelection.push({
        text: `${days} days`,
        value: dayBlocks.div(eraLength).toNumber()
      });

      days = days * 3;
    }

    eraSelection.push({
      text: `Max, ${historyDepth.toNumber()} eras`,
      value: historyDepth.toNumber()
    });

    return eraSelection;
  }

  return [{ text: '', value: 0 }];
}

export async function getStakerPayouts(): Promise<BN> {
  const { api } = Connector.getInstance();
  const migrateEraOpt = api.query.staking.migrateEra && await api.query.staking?.migrateEra() as Option<EraIndex>;

  if (migrateEraOpt && migrateEraOpt.isSome) {
    return migrateEraOpt.unwrap();
  }

  return isFunction(api.tx.staking.payoutStakers) ? new BN(0) : new BN(1_000_000_000);
}
