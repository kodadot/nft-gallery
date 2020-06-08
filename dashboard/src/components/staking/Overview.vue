<template>
  <div>
    <DisabledInput
      label="Best Block" :value="currentBlock.toString()" />
    <DisabledInput
      label="Waiting" :value="`${next.length}`" />
    <DisabledInput
      label="Nominators" :value="nominators" />
    <b-progress v-if="!SummarySessionLoaded"
      size="is-large" type="is-primary" show-value>Fetching data</b-progress>
    <SummarySession :currentBlock="currentBlock" @loadedSession="sessionIsLoaded" />
    <TableOverview :validators="validators" />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import SummarySession from '@/components/explorer/SummarySession.vue'
import DisabledInput from '@/components/shared/DisabledInput.vue';
import TableOverview from './TableOverview.vue';

@Component({
  components: {
    SummarySession,
    DisabledInput,
    TableOverview,
  }
})

// await api.derive.accounts.info('G7eJUS1A7CdcRb2Y3zEDvfAJrM1QtacgG6mPD1RsPTJXxPQ')
// await api.derive.staking.query('EtgM5E6pecndYpKCLkfYeRfKSmVxT1mVvaxceJFnhuKqTpG')
export default class Overview extends Vue {
  private SummarySessionLoaded: boolean = false;
  private currentBlock: any = {};
  private subs: any[] = [];

  @Prop() private next!: any[];
  @Prop({default: '-'}) private nominators!: string;
  @Prop() private stakingOverview!: any;
  @Prop() private validators!: any;

  private sessionIsLoaded() {
    this.SummarySessionLoaded = true
  }

  private async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.currentBlock = value));
  }

  private beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>
