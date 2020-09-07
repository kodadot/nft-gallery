<template>
  <div>
    <Summary :overview="stakingOverview" :currentBlock="currentBlock" :session="sessionProgress" :waiting="waiting" />
     <div>
      <SectionTitle title="Validators" />
    </div>
    <TableOverview :validators="validators" :rewardPoints="rewardPoints" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, PropSync, Mixins } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import SummarySession from '@/components/explorer/SummarySession.vue'
import DisabledInput from '@/components/shared/DisabledInput.vue';
import TableOverview from './TableOverview.vue';
import Subscribe from '@/utils/mixins/subscribeMixin'
import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import { AccountId, EraRewardPoints } from '@polkadot/types/interfaces';
import Summary from './Summary.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import { mapEraPoint } from './getEraPoints'
import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { getStashIds } from './Actions/stashInfo';

@Component({
  components: {
    SummarySession,
    DisabledInput,
    TableOverview,
    Summary,
    SectionTitle
  }
})

// await api.derive.accounts.info('G7eJUS1A7CdcRb2Y3zEDvfAJrM1QtacgG6mPD1RsPTJXxPQ')
// await api.derive.staking.query('EtgM5E6pecndYpKCLkfYeRfKSmVxT1mVvaxceJFnhuKqTpG')
export default class Overview extends Mixins(Subscribe) {
  private SummarySessionLoaded: boolean = false;
  private currentBlock: any = {};
  private stakingOverview: DeriveStakingOverview = {} as DeriveStakingOverview;
  private rewardPoints: Record<string, string> = {};
  private sessionProgress: DeriveSessionProgress = {} as DeriveSessionProgress;
  private waiting: number = 0;

  private async mounted() {
    const { api } = Connector.getInstance();
    this.subscribe(api.derive.chain.bestNumber, [], (value: any) => this.currentBlock = value);
    this.subscribe(api.derive.staking.overview, [], this.handleStakingOverview)
    this.subscribe(api.derive.staking.currentPoints, [], (value: EraRewardPoints) => this.rewardPoints = mapEraPoint(value.individual))
    this.subscribe(api.derive.session.progress, [], (value: DeriveSessionProgress) =>  this.sessionProgress = value)
  }

  private async handleStakingOverview(stakingOverview: DeriveStakingOverview) {
    this.stakingOverview = stakingOverview;
    const allStashes = await getStashIds();
    // TODO: getting different number than polkadot.js :) 
    // this.waiting = allStashes.filter((address) => !stakingOverview.validators.includes(address as any))?.length
  }

  get validators(): AccountId[] {
    return this.stakingOverview.validators || []
  }

}
</script>
