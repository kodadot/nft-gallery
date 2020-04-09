<template>
  <div id="explorer">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Chain Info">
        <Summary />
        <!-- MINEFIELD -->
        <!-- <router-link :to="{ name: 'explorerByTabHash', 
          params: { tab: 1, hash: '0xb9877a09d99927abcdca4031eb443b5ca1346124b59545a36d26f2bf9bb17ce7' }}">
          Take me to 0xb9877a09d99927
        </router-link>
        <router-link :to="{ name: 'explorerByTab', 
          params: { tab: 1 }}">
          Take me to 0xb9877a09d99927
        </router-link> 
        <router-link :to="{ path: '/explorer/1' }"> path /1</router-link>
        <a href="#/explorer/1">take me to /1</a> -->
      </b-tab-item>
      <b-tab-item label="Block Details">
				<BlockDetails 
          :chainName="chainName.toString()"
					:lastBlock="currentBlock.toString()" />
      </b-tab-item>      
      <!-- <b-tab-item label="Node Info"> -->
        <!-- <NodeDetails :totalPeers="nodeInfo.health.peers"
        :isSyncing="nodeInfo.health.isSyncing"
        :ourBest="nodeInfo.blockNumber"
         /> -->
      <!-- </b-tab-item> -->
    </b-tabs>
    <!-- <p>Recent Block {{conn.header.number}}</p> -->
    <!-- <p>Genesis Hash {{api.genesisHash}}</p> -->
    <!-- <p>RuntimeVersion {{api.runtimeVersion}}</p>
    <p>Library Info {{api.libraryInfo}}</p> -->

  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Connector from '@vue-polkadot/vue-api';
import Card from '../shared/Card.vue';
import BlockDetails from './BlockDetails.vue';
import NodeDetails from './NodeDetails.vue';
import Summary from './Summary.vue';

@Component({
  components: {
		Card,
    BlockDetails,
    NodeDetails,
    Summary,
  },
})
export default class Explorer extends Vue {
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
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.currentBlock = value.toString()));
    this.subs.push(await api.rpc.system.chain((value: any) => this.chainName = value.toString()));
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

  @Watch('$route.params.tab')
  public async reflect() {
    this.activeTab = Number(this.$route.params.tab);
  }

  @Watch('activeTab')
  public async updateLocation() {
    if (typeof this.activeTab === 'number') {
      this.$router.replace('/explorer/' + this.activeTab);
    }
  }

  public async mounted(): Promise<void> {
    this.reflect();
    this.loadExternalInfo();
  }

  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }

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
      // const apiResponse = await (this as any).$http.api.rpc.system.chain();
      // this.conn.chainName = await apiResponse.toString();
      // const apiPeers = await (this as any).$http.api.rpc.system.peers();
      // this.nodeInfo.peers = await apiPeers;
      // const apiBestNumber = await (this as any).$http.api.derive.chain.bestNumber();
      // this.subs.push(await (this as any).$http.api.derive.chain.bestNumber((val: any) => {
      //   this.nodeInfo.blockNumber = val.toString();
      // }));
      // const apiHealth = await (this as any).$http.api.rpc.system.health();
      // this.nodeInfo.health = await apiHealth;

      // this.nodeInfo.blockNumber = await apiBestNumber.toString();
      // const apiSession = await (this as any).$http.api.query.session.validators();
      // this.nodeInfo.session = await apiSession;
      // const apiSessionLength = await (this as any).$http.api.query.session.sessionLength();
      // this.nodeInfo.session.length = await apiSessionLength;
      // const apiSessionProgress = await (this as any).$http.api.derive.session.sessionProgress();
      // this.nodeInfo.session.progress = await apiSessionProgress;
      // const apiSessionCurrentIndex = await (this as any).$http.api.derive.session.currentIndex;
      // this.nodeInfo.session.currentIndex = await apiSessionCurrentIndex;
      // const apiSessionEraLength = await (this as any).$http.api.derive.session.eraLength;
      // this.nodeInfo.session.eraLength = await apiSessionEraLength;
      // const apiSessionEraProgress = await (this as any).$http.api.derive.session.eraProgress;
      // this.nodeInfo.session.eraProgress = await apiSessionEraProgress;
      // const apiSessionActiveEra = await (this as any).$http.api.derive.session.activeEra;
      // this.nodeInfo.session.activeEra = await apiSessionActiveEra;
      // const apiSessionInfo = await (this as any).$http.api.derive.session.info;
      // this.nodeInfo.session.info = await apiSessionInfo;
      // const apiPendingExtrinsics = await (this as any).$http.api.rpc.author.pendingExtrinsics();
      // this.nodeInfo.extrinsics = await apiPendingExtrinsics;
      // const apiTotalIssuance = await (this as any).$http.api.query.balances.totalIssuance();
      // this.nodeInfo.totalIssuance = await apiTotalIssuance;
      // const apiFinalized = await (this as any).$http.api.derive.chain.bestNumberFinalized();
      // this.nodeInfo.finalized = await apiFinalized;

      // const apiSessionsPerEra = await (this as any).$http.api.consts.staking.sessionsPerEra();
      // this.nodeInfo.sessionsPerEra = await apiSessionsPerEra;
    // }
}
</script>
