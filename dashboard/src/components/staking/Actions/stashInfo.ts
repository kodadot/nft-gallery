import Connector from "@vue-polkadot/vue-api";
import { AccountId, StakingLedger, EraIndex, UnappliedSlash } from "@polkadot/types/interfaces";
import keyring from "@polkadot/ui-keyring";
import { Option } from "@polkadot/types";
import BN from "bn.js";
import { BN_ZERO, u8aConcat, u8aToHex } from '@polkadot/util';
import { StakerState } from './types'
import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { ValidatorPrefs } from '@polkadot/types/interfaces';
import { Codec, ITuple } from '@polkadot/types/types';

export type IsInKeyring = boolean;

interface UseAccounts {
  allAccounts: string[];
  hasAccounts: boolean;
  isAddress: (address: string) => boolean;
}

export function getStashIds(): Promise<string[]> {
  const { api } = Connector.getInstance();
  return api.derive.staking
    .stashes()
    .then((stashes: AccountId[]) =>
      stashes.map(accountId => accountId.toString())
    );
}

export function getAccounts(): UseAccounts {
  const allAddresses = keyring.getAccounts().map(account => account.address);
  const hasAddresses = allAddresses.length !== 0;
  const isAddress = (address: string): boolean =>
    allAddresses.includes(address.toString());

  return { allAccounts: allAddresses, hasAccounts: hasAddresses, isAddress };
}

export async function getOwnStashes(): Promise<[string, IsInKeyring][]> {
  const { allAccounts, hasAccounts } = getAccounts();
  const { api } = Connector.getInstance();

  const ownBonded = await api.query.staking.bonded.multi(allAccounts);
  const ownLedger = await api.query.staking.ledger.multi(allAccounts);

  return getStashes(
    allAccounts,
    ownBonded as Option<AccountId>[],
    ownLedger as Option<StakingLedger>[]
  );
}

function getStashes(
  allAccounts: string[],
  ownBonded: Option<AccountId>[],
  ownLedger: Option<StakingLedger>[]
): [string, IsInKeyring][] {
  const result: [string, IsInKeyring][] = [];

  ownBonded.forEach((value, index): void => {
    value.isSome && result.push([allAccounts[index], true]);
  });

  ownLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.some(([accountId]) => accountId === stashId) &&
        result.push([stashId, false]);
    }
  });

  return result;
}

export async function getAvailableSlashes(): Promise<[BN, UnappliedSlash[]][]> {
  const { api } = Connector.getInstance();
  const indexes = await api.derive.session.indexes();
  const earliestSlash = await api.query.staking.earliestUnappliedSlash();

  if (earliestSlash && earliestSlash.isSome) {
    const from = earliestSlash.unwrap();
      const range: BN[] = [];
      let start = new BN(from);

      while (start.lt(indexes.activeEra)) {
        range.push(start);
        start = start.addn(1);
      }

      if (range.length) {
        const values = await api.query.staking.unappliedSlashes.multi(range);
        return values
        .map((value, index): [BN, any] => [from.addn(index), value])
        .filter(([, slashes]): boolean => slashes.length !== 0)
      }
  }

  return []
}

export interface State {
  bondedTotal?: BN;
  foundStashes?: StakerState[];
}

export function extractState (ownStashes?: StakerState[]): State {
  if (!ownStashes) {
    return {};
  }

  return {
    bondedTotal: ownStashes.reduce((total: BN, { stakingLedger }) =>
      stakingLedger
        ? total.add(stakingLedger.total.unwrap())
        : total,
    BN_ZERO),
    foundStashes: ownStashes
  };
}

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

export type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]> | ValidatorPrefs;
export type Queried = Record<string, [boolean, DeriveStakingAccount, ValidatorInfo]>;

export function getStakerState (stashId: string, allAccounts: string[], allStashes: string[] | undefined, [isOwnStash, { controllerId: _controllerId, exposure, nextSessionIds, nominators, rewardDestination, sessionIds, stakingLedger, validatorPrefs }, validateInfo]: [boolean, DeriveStakingAccount, ValidatorInfo]): StakerState {
  const isStashNominating = !!(nominators && nominators.length);
  const isStashValidating = !(Array.isArray(validateInfo) ? validateInfo[1].isEmpty : validateInfo.isEmpty) || !!(allStashes && allStashes.includes(stashId));
  const nextConcat = u8aConcat(...nextSessionIds.map((id: any): Uint8Array => id.toU8a()));
  const currConcat = u8aConcat(...sessionIds.map((id: any): Uint8Array => id.toU8a()));
  const controllerId = toIdString(_controllerId);

  return {
    controllerId,
    destination: (rewardDestination && rewardDestination.toString().toLowerCase()) || '',
    destinationId: rewardDestination && rewardDestination.toNumber() || 0,
    exposure,
    hexSessionIdNext: u8aToHex(nextConcat, 48),
    hexSessionIdQueue: u8aToHex(currConcat.length ? currConcat : nextConcat, 48),
    isLoading: false,
    isOwnController: allAccounts.includes(controllerId || ''),
    isOwnStash,
    isStashNominating,
    isStashValidating,
    // we assume that all ids are non-null
    nominating: (nominators && nominators.map(toIdString) as string[]) || [],
    sessionIds: (
      nextSessionIds.length
        ? nextSessionIds
        : sessionIds
    ).map(toIdString) as string[],
    stakingLedger,
    stashId,
    validatorPrefs
  };
}
