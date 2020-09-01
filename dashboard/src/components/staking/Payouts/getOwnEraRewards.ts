// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  DeriveEraPoints,
  DeriveEraRewards,
  DeriveStakerReward
} from '@polkadot/api-derive/types';
import { EraIndex } from '@polkadot/types/interfaces';
import { StakerState } from '../Actions/types';

import registry from '@/params/components/typeRegistry';
import { BN_ZERO } from '@polkadot/util';

import Connector from '@vue-polkadot/vue-api';
import { getOwnStashIds } from '../Actions/stashInfo';

interface OwnRewards {
  allRewards?: Record<string, DeriveStakerReward[]> | null;
  isLoadingRewards: boolean;
  rewardCount: number;
}

interface ValidatorWithEras {
  eras: EraIndex[];
  stashId: string;
}

interface Filtered {
  filteredEras: EraIndex[];
  validatorEras: ValidatorWithEras[];
}

function getRewards([[stashIds], available]: [
  [string[]],
  DeriveStakerReward[][]
]): OwnRewards {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  stashIds.forEach((stashId, index): void => {
    allRewards[stashId] = available[index].filter(
      ({ eraReward }) => !eraReward.isZero()
    );
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter(
      rewards => rewards.length !== 0
    ).length
  };
}

function getValRewards(
  validatorEras: ValidatorWithEras[],
  erasPoints: DeriveEraPoints[],
  erasRewards: DeriveEraRewards[]
): OwnRewards {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  validatorEras.forEach(({ eras, stashId }): void => {
    eras.forEach((era): void => {
      const eraPoints = erasPoints.find(p => p.era.eq(era));
      const eraRewards = erasRewards.find(r => r.era.eq(era));

      if (
        eraPoints?.eraPoints.gt(BN_ZERO) &&
        eraPoints?.validators[stashId] &&
        eraRewards
      ) {
        const reward = eraPoints.validators[stashId]
          .mul(eraRewards.eraReward)
          .div(eraPoints.eraPoints);

        if (!reward.isZero()) {
          const total = registry.createType('Balance', reward);

          if (!allRewards[stashId]) {
            allRewards[stashId] = [];
          }

          allRewards[stashId].push({
            era,
            eraReward: eraRewards.eraReward,
            isEmpty: false,
            isValidator: true,
            nominating: [],
            validators: {
              [stashId]: {
                total,
                value: total
              }
            }
          });
        }
      }
    });
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter(
      rewards => rewards.length !== 0
    ).length
  };
}

export default async function getOwnEraRewards(
  maxEras?: number,
  ownValidators?: StakerState[]
): Promise<OwnRewards> {
  const { api } = Connector.getInstance();

  const stashIds = await getOwnStashIds();
  const allEras = (await api.derive.staking.erasHistoric(false)) as EraIndex[];
  let state: OwnRewards = {
    allRewards: null,
    isLoadingRewards: true,
    rewardCount: 0
  };

  let { filteredEras, validatorEras }: Filtered = {
    filteredEras: [],
    validatorEras: []
  };

  const setState = (updatedState: OwnRewards) =>
    (state = { ...state, ...updatedState });
  const setFiltered = (updatedState: Filtered) => {
    filteredEras = { ...filteredEras, ...updatedState.filteredEras };
    validatorEras = { ...validatorEras, ...updatedState.validatorEras };
  };

  if (allEras && maxEras) {
    const filteredEras = allEras.slice(-1 * maxEras);
    const validatorEras: ValidatorWithEras[] = [];

    if (ownValidators?.length) {
      ownValidators.forEach(({ stakingLedger, stashId }): void => {
        if (stakingLedger) {
          const eras = filteredEras.filter(
            era => !stakingLedger.claimedRewards.some(c => era.eq(c))
          );

          if (eras.length) {
            validatorEras.push({ eras, stashId });
          }
        }
      });
    }

    setFiltered({ filteredEras, validatorEras });
  }

  console.log('stakerRewards', stashIds, filteredEras);
  const stakerRewards = await api.derive.staking.stakerRewardsMultiEras(
    stashIds,
    filteredEras
  );
  const erasPoints = await api.derive.staking._erasPoints(filteredEras, false);
  const erasRewards = await api.derive.staking._erasRewards(
    filteredEras,
    false
  );

  if (stakerRewards && !ownValidators) {
    console.log('stakerRewards', stakerRewards);
    

    setState(getRewards([[stashIds], stakerRewards]));
  }

  if (erasPoints && erasRewards && ownValidators) {
    setState(getValRewards(validatorEras, erasPoints, erasRewards));
  }

  return state;
}
