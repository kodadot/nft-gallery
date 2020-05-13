<template>
  <div>
    <DisabledInput
      label="Best Block" :value="currentBlock.toString()" />
    <b-progress v-if="!SummarySessionLoaded"
      size="is-large" type="is-primary" show-value>Fetching data</b-progress>
    <SummarySession :currentBlock="currentBlock" @loadedSession="sessionIsLoaded" />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import SummarySession from '@/components/explorer/SummarySession.vue'
import DisabledInput from '@/components/shared/DisabledInput.vue';

@Component({
  components: {
    SummarySession,
    DisabledInput,
  }
})
export default class Overview extends Vue {
  private SummarySessionLoaded: boolean = false;
  private currentBlock: any = {};
  private subs: any[] = [];

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
