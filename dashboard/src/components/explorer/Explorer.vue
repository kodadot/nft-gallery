<template>
  <div id="explorer">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Chain Info">
        <b-field>
          chain name - {{conn.chainName}}
          last block {{nodeInfo.blockNumber}}
          <!-- target -> 6s -->
          total issuance {{nodeInfo.totalIssuance}}
          session 
          <!-- {{nodeInfo.session.length}} /  -->
          <!-- {{nodeInfo.sessionLength}} -->
          <!-- era {{nodeInfo.sessionsPerEra}} -->
          finalized {{nodeInfo.finalized}}
        </b-field>
        best<br>
        <!-- [recent blocks] -->
      </b-tab-item>
      <b-tab-item label="Block Details">
        <p>BlockNumber {{nodeInfo.blockNumber}}</p>
        
        <p><h1>Extrinsics</h1></p>
        <Card nature='timestamp.set (#0)'
          natureDesc="Set the current time. This call should be invoked exactly once per block. It will panic at the finalization phase, if this call hasn't been invoked by that time. The timestamp should be greater than the previous one by the amount specified by `MinimumPeriod`. The dispatch origin for this call must be `Inherent`."
          type="1581518316000"
          extrinsicHash="0x00781baf5287f2bc103dc76ced4ef768516730881afcd5e39605827afd868b88"
          lifetime="lifetime"
        />
        <!-- parentHash -><br>
        extrinsicsRoot -><br>
        StateRoot -><br>
        [extrinsics]<br>
        [events]<br>
        [logs]<br> -->
      </b-tab-item>      
      <b-tab-item label="Node Info">
        total peers {{nodeInfo.health.peers}}<br>
        syncing {{nodeInfo.health.isSyncing}}<br>
        our best {{nodeInfo.blockNumber}}
        peer best 
        <p v-if="bestPeer"> {{bestPeer.bestNumber}}</p>
        Queued tx {{nodeInfo.extrinsics.length}}
        <!-- [[connected peers]] -->
        <!-- should be separate component -->
        <!-- <p>Peers {{nodeInfo.peers}}</p> -->
      </b-tab-item>
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
import Card from '../shared/Card.vue';

@Component({
  components: {
    Card,
  }
})
export default class Explorer extends Vue {
  public activeTab: number = 1;
  public conn: any = { chain: '', nodeName: '', nodeVersion: '', header: {}};
  public bestPeer: any = null;
  public bestPeerBlock: any = null;
  public api: any = null;
  public nodeInfo: any = {
    blockNumber: '', health: '', peers: '', extrinsics: '', session: '',
    totalIssuance: '', finalized: '', era: '', sessionsPerEra: '',
  };

  // You may have an infinite update loop in watcher with expression "nodeInfo.peers"
  @Watch('nodeInfo.peers')
  public async sortBestPeerBlock() {
    // console.log(this.nodeInfo.peers.length);
    if (this.nodeInfo.peers.length) {
      this.bestPeer = this.nodeInfo.peers.sort((a: any, b: any): number => b.bestNumber.cmp(a.bestNumber))[0];
      this.bestPeerBlock = this.bestPeer.bestNumber;
    }
  }

  // @Watch('activeTab')
  // public async updateLocation() {
  //   // console.log(typeof this.activeTab);
  //   if (typeof this.activeTab === 'number') {
  //     this.$router.replace('/explorer/' + this.activeTab);
  //   }
  // }

  public async loadExternalInfo() {
    if ((this as any).$http.api) {
      const apiResponse = await (this as any).$http.api.rpc.system.chain();
      this.conn.chainName = await apiResponse.toString();
      const apiPeers = await (this as any).$http.api.rpc.system.peers();
      this.nodeInfo.peers = await apiPeers;
      const apiBestNumber = await (this as any).$http.api.derive.chain.bestNumber();
      this.nodeInfo.blockNumber = await apiBestNumber.toString();
      const apiHealth = await (this as any).$http.api.rpc.system.health();
      this.nodeInfo.health = await apiHealth;
      const apiSession = await (this as any).$http.api.query.session.validators();
      this.nodeInfo.session = await apiSession;
      const apiSessionLength = await (this as any).$http.api.query.session.sessionLength();
      this.nodeInfo.sessionLength = await apiSessionLength;
      const apiPendingExtrinsics = await (this as any).$http.api.rpc.author.pendingExtrinsics();
      this.nodeInfo.extrinsics = await apiPendingExtrinsics;
      const apiTotalIssuance = await (this as any).$http.api.query.balances.totalIssuance();
      this.nodeInfo.totalIssuance = await apiTotalIssuance;
      const apiFinalized = await (this as any).$http.api.derive.chain.bestNumberFinalized();
      this.nodeInfo.finalized = await apiFinalized;

      // const apiSessionsPerEra = await (this as any).$http.api.consts.staking.sessionsPerEra();
      // this.nodeInfo.sessionsPerEra = await apiSessionsPerEra;
    }
  }

  // public async switchTab() {
  //   this.activeTab = Number(this.$route.params.tab);
  // }

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
    // th is.switchTab();
  }
}
</script>