<template>
  <div>
    <div>
      <SectionTitle title="Intentions" />
    </div>
    <TableOverview :validators="validators" :nominators="nominators" />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import SectionTitle from '@/components/shared/SectionTitle.vue'
import TableOverview from './TableOverview.vue'
import Subscribe from '@/utils/mixins/subscribeMixin'
import Connector from '@vue-polkadot/vue-api';
import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import { getValidators, extractNominators } from './utils'

const components = { SectionTitle, TableOverview }


@Component({ components })
export default class Waiting extends Mixins(Subscribe) {
  private stakingOverview: any = {};
  private nominators: any = {};


    private async mounted() {
    const { api } = Connector.getInstance();
    this.subscribe(api.derive.staking.overview, [], this.handleStakingOverview)
    this.subscribe(api.query.staking.nominators.entries, [], this.handleNominators)
  }

  private handleStakingOverview(stakingOverview: DeriveStakingOverview) {
    this.stakingOverview = stakingOverview;
  }

  private handleNominators(nominators: [any, any]) {
    this.nominators = extractNominators(nominators)
  }


  get validators(): string[] {
    return getValidators(this.stakingOverview)
  }

  
}
</script>
