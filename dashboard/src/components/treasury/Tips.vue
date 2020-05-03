<template>
  <div>
    Tips works!
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
export default class Tips extends Vue {
  private subs: any[] = [];
  private info?: any = {};

  public async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.treasury.proposals((val: any) => this.info = val));
  }

  private lenghtOf(array: any[]) {
    return (array && array.length) || 0;

  }

  private async subscribe(fn: any, args: any, callback: any) {
    this.subs.push(await fn(...args, callback))
  }

  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }

}
</script>

