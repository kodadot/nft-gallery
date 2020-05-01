<template>
  <Summary :approvalCount="info.approvals.length" :proposalCount="info.proposals.length" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import Summary from './Summary.vue'

import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    Summary
  }
})
export default class Treasury extends Vue {
  private subs: any[] = [];
  private info?: any = {};

  public async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.treasury.proposals((val: any) => this.info = val));
    

  }



  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }

}
</script>

<style scoped>
.summary-progressbar {
  flex-basis: 20em;
}
</style>
