<template>
  <div>
    <ElectionBanner />
    <div>
      <SectionTitle title="Stashes" />
    </div>
    <TableOverview :validators="validators" />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import ElectionBanner from './ElectionBanner.vue';
import TableOverview from './TableOverview.vue';
import SectionTitle from '@/components/shared/SectionTitle.vue';
import {
  getStashIds,
  getOwnStashes,
  IsInKeyring,
  getAvailableSlashes,
  extractState,
  State,
  getAccounts,
  getStakerState
} from './stashInfo';
import { UnappliedSlash } from '@polkadot/types/interfaces';
import BN from 'bn.js';
import { emptyObject } from '@/utils/empty';
import Connector from '@vue-polkadot/vue-api';
import SubscribeMixin from '@/utils/mixins/subscribeMixin';
import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { AccountId, ValidatorPrefs } from '@polkadot/types/interfaces';
import { Codec, ITuple } from '@polkadot/types/types';
import { StakerState } from './types';

type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]> | ValidatorPrefs;
type Queried = Record<string, [boolean, DeriveStakingAccount, ValidatorInfo]>;

const components = {
  ElectionBanner,
  TableOverview,
  SectionTitle
};

@Component({ components })
export default class Actions extends Mixins(SubscribeMixin) {
  private allStashes: string[] = [];
  private ownStashes: [string, IsInKeyring][] = [];
  private allSlashes: [BN, UnappliedSlash[]][] = [];
  private state: State = emptyObject<State>();

  get validators() {
    return this.state.foundStashes || [];
  }

  public async mounted() {
    this.allStashes = await getStashIds();
    this.ownStashes = await getOwnStashes();
    this.allSlashes = await getAvailableSlashes();
    await this.getOwnStashInfos();

    console.log('[DEBUG] ownStashes', this.ownStashes);
    console.log('[DEBUG] allStashes', this.allStashes);
  }

  private async getOwnStashInfos(): Promise<void> {
    const { api } = Connector.getInstance();
    const { allAccounts, hasAccounts } = getAccounts();
    const { ownStashes, allStashes } = this;

    console.log('here', ownStashes && ownStashes.length);

    if (ownStashes && ownStashes.length) {
      const stashIds = ownStashes.map(([stashId]) => stashId);
      const fns: any[] = [
        [api.derive.staking.accounts, stashIds],
        [api.query.staking.validators.multi, stashIds]
      ];

      (window as any).fns = fns;

      console.log(stashIds);

      this.subscribe(api.combineLatest, [fns], this.stateCallBack);
    }
  }

  private stateCallBack([accounts, validators]: [any, any]) {
    const { ownStashes, allStashes } = this;
    const { allAccounts } = getAccounts();
    const queried = ownStashes.reduce(
      (queried: Queried, [stashId, isOwnStash], index): Queried => ({
        ...queried,
        [stashId]: [isOwnStash, accounts[index], validators[index]]
      }),
      {}
    );

    const stashInfo = ownStashes
      .filter(([stashId]) => queried[stashId])
      .map(([stashId]) =>
        getStakerState(stashId, allAccounts, allStashes, queried[stashId])
      );

    this.state = extractState(stashInfo);
    console.log('[INFO] State ', this.state);
  }
}
</script>
