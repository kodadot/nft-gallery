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
import { Component, Prop, Vue, Watch, PropSync, Mixins } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import SummarySession from '@/components/explorer/SummarySession.vue'
import DisabledInput from '@/components/shared/DisabledInput.vue';
import TableOverview from './TableOverview.vue';
import Subscribe from '@/utils/mixins/subscribeMixin'
import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import Summary from './Summary.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'

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
  private stakingOverview: any = {};

  private async mounted() {
    const { api } = Connector.getInstance();
    this.subscribe(api.derive.chain.bestNumber, [], (value: any) => this.currentBlock = value);
    this.subscribe(api.derive.staking.overview, [], this.handleStakingOverview)
  }

  private handleStakingOverview(stakingOverview: DeriveStakingOverview) {
    this.stakingOverview = stakingOverview;
  }

  get validators(): AccountId[] {
    return this.stakingOverview.validators || []
  }

}
</script>
