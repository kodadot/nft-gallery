import { Option, StorageKey } from '@polkadot/types';
import { AccountId, EraIndex, Nominations } from '@polkadot/types/interfaces';
import { DeriveStakingOverview } from '@polkadot/api-derive/types';

export type AccountExtend = [string, boolean, boolean];

export interface Filtered {
  elected?: AccountExtend[];
  validators?: AccountExtend[];
  waiting?: AccountExtend[];
}

export function extractNominators (nominations: [StorageKey, Option<Nominations>][]): Record<string, [string, EraIndex, number][]> {
  return nominations.reduce((mapped: Record<string, [string, EraIndex, number][]>, [key, optNoms]) => {
    if (optNoms.isSome) {
      const nominatorId = key.args[0].toString();
      const { submittedIn, targets } = optNoms.unwrap();

      targets.forEach((_validatorId, index): void => {
        const validatorId = _validatorId.toString();
        const info: [string, EraIndex, number] = [nominatorId, submittedIn, index + 1];

        if (!mapped[validatorId]) {
          mapped[validatorId] = [info];
        } else {
          mapped[validatorId].push(info);
        }
      });
    }

    return mapped;
  }, {});
}

export default extractNominators


function filterAccounts (accounts: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId): boolean => !without.includes(accountId as any))
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([,, isFavA]: AccountExtend, [,, isFavB]: AccountExtend): number =>
      isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1)
    );
}

function accountsToString (accounts: AccountId[] = []): string[] {
  return accounts.map((accountId): string => accountId.toString());
}

export function getFiltered (stakingOverview: DeriveStakingOverview, favorites: string[] = [], next: string[] = []): Filtered {
  const allElected = accountsToString(stakingOverview.nextElected);
  const validatorIds = accountsToString(stakingOverview.validators);
  const validators = filterAccounts(validatorIds, allElected, favorites, []);
  const elected = filterAccounts(allElected, allElected, favorites, validatorIds);
  const waiting = filterAccounts(next, [], favorites, allElected);

  return {
    elected,
    validators,
    waiting
  };
}

export function getValidators(stakingOverview: DeriveStakingOverview): string[] {
  return accountsToString(stakingOverview.nextElected).concat(accountsToString(stakingOverview.validators));
}
