<template>
  <div>
    <Summary
      :approvalCount="approvalsLength"
      :proposalCount="proposalsLength"
    />
    <div>
    <SectionTitle title="Proposals" />
    </div>
    <Proposals :proposals="info.proposals" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import Summary from './Summary.vue'
import Proposals from './Proposals.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'

import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    Summary,
    Proposals,
    SectionTitle
  }
})
export default class Treasury extends Vue {
  private subs: any[] = [];
  private info?: any = {};

  public async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.treasury.proposals((val: any) => this.info = val));
  }

  private lenghtOf(array: any[]) {
    return (array && array.length) || 0;

  }

  get approvalsLength() {
    return this.lenghtOf(this.info.approvals);
  }

  get proposalsLength() {
    return this.lenghtOf(this.info.proposals);
  }

  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }

}
</script>

