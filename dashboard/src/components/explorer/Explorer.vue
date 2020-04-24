<template>
  <div>
    <b-tabs v-model="activeTab" @input="tabClick">
      <b-tab-item label="⛓ Chain">
        <b-progress v-if="!loadedSummary"
        size="is-large" 
        type="is-primary" 
        show-value>Fetching data</b-progress>
        <Summary @loaded="summaryIsLoaded" />
      </b-tab-item>
      <b-tab-item label="🔍 Block">
				<BlockDetails 
          :chainName="chainName.toString()"
					:lastBlock="currentBlock.toString()"
          :queryBlock="$route.params.hash" />
      </b-tab-item>
      <b-tab-item label="👁 Node">
        <NodeDetails />
      </b-tab-item>
      <b-tab-item label="🔬 Verbose">
        <NodeVerbose />
      </b-tab-item>
    </b-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Connector from '@vue-polkadot/vue-api';
import BlockDetails from './BlockDetails.vue';
import Summary from './Summary.vue';
import NodeDetails from './NodeDetails.vue';
import NodeVerbose from './NodeVerbose.vue';

@Component({
  components: {
    BlockDetails,
    NodeDetails,
    Summary,
    NodeVerbose,
  },
})
export default class Explorer extends Vue {
  public loadedSummary: boolean = false;
  public activeTab: number = 0;
  private subs: any[] = [];
  private currentBlock: any = {};
  private chainName: any = {};
  private blockHash: any = ''

  public async loadExternalInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.bestNumberFinalized((value: any) => this.currentBlock = value.toString()));
    this.subs.push(await api.rpc.system.chain((value: any) => this.chainName = value.toString()));
  }
  
  @Watch('$route.params.tab')
  public async reflect() {
    if (typeof this.$route.params.tab === 'number') {
      this.activeTab = Number(this.$route.params.tab);
    }
  }
  
  public summaryIsLoaded(): any {
    this.loadedSummary = true;
  }

  public async tabClick(): Promise<void> {
    this.$router.replace(`/explorer/${this.activeTab}`)
    if (this.activeTab === 1) {
      const { api } = Connector.getInstance();
      this.subs.push(this.blockHash = await api.rpc.chain.getBlockHash((this.currentBlock)));
      this.$router.replace(`/explorer/${this.activeTab}/${this.blockHash}`)
    }
  }

  public async mounted(): Promise<void> {
    this.reflect();
    this.loadExternalInfo();
  }

  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>
