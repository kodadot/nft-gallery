<template>
  <div>
    <Summary :overview="stakingOverview" />
    <div>
      <SectionTitle title="Validators" />
    </div>
    <TableOverview :validators="validators" />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import Summary from './Summary.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import TableOverview from './TableOverview.vue'
import Subscribe from '@/utils/mixins/subscribeMixin'
import Connector from '@vue-polkadot/vue-api';
import { DeriveSessionIndexes, DeriveStakingElected, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import { emptyObject } from '@/utils/empty'
import { BN_ONE, BN_ZERO } from '@polkadot/util';
import { EraIndex } from '@polkadot/types/interfaces';
import { Option } from '@polkadot/types';
import { Balance } from '@polkadot/types/interfaces';
import { SortedTargets } from '../types';
import { extractInfo } from './utills'
import { baseBalance } from '../utils'

const defaultState = {
  lastReward: BN_ZERO,
  totalStaked: BN_ZERO,
  validators: 0,
  nominators: 0,
  totalIssuance: BN_ZERO
}


const components = {
  Summary,
  SectionTitle,
  TableOverview
}

@Component({
  components
})
export default class Targets extends Mixins(Subscribe) {
  private electedInfo = emptyObject<DeriveStakingElected>();
  private waitingInfo = emptyObject<DeriveStakingWaiting>();
  private lastEra = BN_ZERO;
  private lastReward = BN_ZERO;
  private targets = emptyObject<Partial<SortedTargets>>();
  private loading: boolean = false;
  


  private async mounted() {
    const { api } = Connector.getInstance();
    this.loading = true;
    this.electedInfo = await api.derive.staking.electedInfo();
    this.waitingInfo = await api.derive.staking.waitingInfo();
    console.log(this.electedInfo, this.waitingInfo);
    await api.derive.session.indexes().then(this.handleLastEra)
    this.loading = false;
    // this.subscribe(api.derive.session.indexes, [], this.handleLastEra)
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

  get stakingOverview() {
    return this.isEmpty(this.targets) ? defaultState : {
      lastReward: this.lastReward,
      totalStaked: this.targets.totalStaked,
      validators: this.targets.validators && this.targets.validators.length,
      nominators: this.targets.nominators && this.targets.nominators.length,
      totalIssuance: BN_ZERO
    }
  }

  private isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0
  }

  get validators() {
    return this.targets.validators || []
  }



}
</script>
