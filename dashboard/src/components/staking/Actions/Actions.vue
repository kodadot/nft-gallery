<template>
  <div>
    <ElectionBanner />
    <div>
      <SectionTitle title="Stashes" />
    </div>
    <TableOverview :validators="validators" :targetValidatorIds="targetValidatorIds" />
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
import { DeriveSessionIndexes, DeriveStakingElected, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import { Codec, ITuple } from '@polkadot/types/types';
import { StakerState } from './types';
import { BN_ZERO } from '@polkadot/util';
import { SortedTargets } from '../types';
import { extractInfo } from '../Targets/utills';
import { baseBalance } from '../utils';
import { Option } from '@polkadot/types';
import { Balance } from '@polkadot/types/interfaces';

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
  private electedInfo = emptyObject<DeriveStakingElected>();
  private waitingInfo = emptyObject<DeriveStakingWaiting>();
  private lastEra = BN_ZERO;
  private lastReward = BN_ZERO;
  private targets = emptyObject<Partial<SortedTargets>>();

  get validators() {
    return this.state.foundStashes || [];
  }

  get targetValidatorIds() {
    return this.targets.validatorIds || [];
  }

  public async mounted() {
    this.allStashes = await getStashIds();
    this.ownStashes = await getOwnStashes();
    this.allSlashes = await getAvailableSlashes();
    await this.getOwnStashInfos();
    await this.getTargets();

    console.log('[DEBUG] ownStashes', this.ownStashes);
    console.log('[DEBUG] allStashes', this.allStashes);
  }

  private async getTargets() {
    const { api } = Connector.getInstance();
    this.electedInfo = await api.derive.staking.electedInfo();
    this.waitingInfo = await api.derive.staking.waitingInfo();
    await api.derive.session.indexes().then(this.handleLastEra)
  }
  
   private async handleLastEra({ activeEra }: DeriveSessionIndexes) {
    this.lastEra = activeEra.gtn(0) ? activeEra.subn(1) : BN_ZERO
    if (this.lastEra) {
      const { api } = Connector.getInstance();
      this.lastReward = await api.query.staking.erasValidatorReward(this.lastEra).then((optBalance: Option<Balance>) => optBalance.unwrapOrDefault());
      this.targets = extractInfo([], baseBalance(), this.electedInfo, this.waitingInfo, [], this.lastReward);
      (window as any).targets = this.targets;
    }
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
