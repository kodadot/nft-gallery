<template>
  <div>
    <Summary
      :approvalCount="approvalsLength"
      :proposalCount="proposalsLength"
    />
    <b-button type="is-primary" icon-left="plus" class="treasury-button__submit">
      Submit Proposal
    </b-button>
    <div>
      <SectionTitle title="Proposals" />
    </div>
    <EmptyGuard :array="info.proposals" label="Proposals">
      <Proposals :proposals="info.proposals" />
    </EmptyGuard>
    <div>
      <SectionTitle title="Approvals" />
    </div>
    <EmptyGuard :array="info.approvals" label="Approvals">
      <Proposals :proposals="info.approvals" />
    </EmptyGuard>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import Summary from './Summary.vue'
import Proposals from './Proposals.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import EmptyGuard from '@/components/shared/wrapper/EmptyGuard.vue'

import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    Summary,
    Proposals,
    SectionTitle,
    EmptyGuard
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

<style>
.treasury-button__submit {
  margin-top: 1em;
}
</style>

