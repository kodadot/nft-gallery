<template>
  <div>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Chain Info">
        <b-progress v-if="!loadedSummary"
        size="is-large" show-value>Fetching data</b-progress>
        <Summary @loaded="summaryIsLoaded" />
        <!-- MINEFIELD UWAGA-->
        <!-- <router-link :to="{ name: 'explorerByTabHash',
          params: { tab: 1, hash: '0x470330a6551cded58d5131e243b988354bbe9c5385723207aadc49fe13e7d929' }}">
          Take me to 0x470330a6551cded
        </router-link> -->
        <!-- <router-link :to="{ name: 'explorerByTab', 
          params: { tab: 1 }}">
          Take me to 0xb9877a09d99927
        </router-link> -->
        <!-- <router-link :to="{ path: '/explorer/1/0x901622909bbf892e5de8979211a6fb2361161a0b5276e328eecfd4b268bc64b1' }"> path /1</router-link>  -->
        <!-- <a href="#/explorer/1/0x901622909bbf892e5de8979211a6fb2361161a0b5276e328eecfd4b268bc64b1">take me to /1</a> -->
      </b-tab-item>
      <b-tab-item label="Block Details">
				<BlockDetails 
          :chainName="chainName.toString()"
					:lastBlock="currentBlock.toString()" />
      </b-tab-item>
      <!-- <b-tab-item label="Verbose">
        <NodeVerbose />
      </b-tab-item> -->
    </b-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Connector from '@vue-polkadot/vue-api';
import BlockDetails from './BlockDetails.vue';
import Summary from './Summary.vue';
// import NodeVerbose from './NodeVerbose.vue';

@Component({
  components: {
    BlockDetails,
    Summary,
    // NodeVerbose,
  },
})
export default class Explorer extends Vue {
  public loadedSummary: boolean = false;
  public activeTab: number = 0;
  public conn: any = { chain: '', nodeName: '', nodeVersion: '', header: {}};
  public bestPeer: any = null;
  public bestPeerBlock: any = null;
  public api: any = null;
  public nodeInfo: any = {
    blockNumber: '', health: '', peers: '', extrinsics: '', session: {},
    totalIssuance: '', finalized: '', era: '', sessionsPerEra: '',
  };
  private subs: any[] = [];
  private currentBlock: any = {};
  private chainName: any = {};

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

  @Watch('activeTab')
  public async updateLocation() {
    if (typeof this.activeTab === 'number') {
      this.$router.replace('/explorer/' + this.activeTab);
    }
  }
  
  public summaryIsLoaded(): any {
    this.loadedSummary = true;
  }

  public async mounted(): Promise<void> {
    this.reflect();
    this.loadExternalInfo();
  }

  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }

  // @Watch('activeTab')
  // @Watch('$route.params.hash')
  // @Watch('$route.params.tab')
  // public async updateHash() {
  //   // if (typeof this.$route.params.hash) {
  //   //   this.$router.replace(`/explorer/${this.$route.params.tab}/${this.$route.params.hash}`)
  //   // } else {
  //     this.$router.replace(`/explorer/${this.$route.params.tab}`)
  //     this.activeTab = Number(this.$route.params.tab);
  //   // }
  // }
  // CAN DELETE THIS WISE KNOWLEDGE LATER
  // You may have an infinite update loop in watcher with expression "nodeInfo.peers"
  // @Watch('nodeInfo.peers')
  // public async sortBestPeerBlock() {
  //   // console.log(this.nodeInfo.peers.length);
  //   if (this.nodeInfo.peers.length) {
  //     this.bestPeer = this.nodeInfo.peers.sort((a: any, b: any): number => b.bestNumber.cmp(a.bestNumber))[0];
  //     this.bestPeerBlock = this.bestPeer.bestNumber;
  //   }
  // }
  // if ((this as any).$http.api) {
  // const apiPeers = await (this as any).$http.api.rpc.system.peers();
  // this.nodeInfo.peers = await apiPeers;
  // const apiHealth = await (this as any).$http.api.rpc.system.health();
  // this.nodeInfo.health = await apiHealth;
  // const apiPendingExtrinsics = await (this as any).$http.api.rpc.author.pendingExtrinsics();
  // this.nodeInfo.extrinsics = await apiPendingExtrinsics;
  // const apiTotalIssuance = await (this as any).$http.api.query.balances.totalIssuance();
  // this.nodeInfo.totalIssuance = await apiTotalIssuance;
}
</script>
