<template>
  <div id="explorer">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Chain Info">
        <b-field>
          Chain name - {{conn.chainName}}
          Last Block {{nodeInfo.blockNumber}}
          <!-- target -> 6s -->
          total issuance {{nodeInfo.totalIssuance}}
          <p>Session {{nodeInfo.session.length}}</p>
          finalized {{nodeInfo.finalized}}
        </b-field>
        best<br>
        <!-- [recent blocks] -->
      </b-tab-item>
      <b-tab-item label="Block Details">
        BlockNumber <p>{{nodeInfo.blockNumber}}</p>
        <!-- parentHash -><br>
        extrinsicsRoot -><br>
        StateRoot -><br>
        [extrinsics]<br>
        [events]<br>
        [logs]<br> -->
      </b-tab-item>      
      <b-tab-item label="Node Info">
        Total Peers {{nodeInfo.health.peers}}<br>
        Syncing {{nodeInfo.health.isSyncing}}<br>
        Our best 
        <p>{{nodeInfo.blockNumber}}</p>
        Peer best 
        <p v-if="bestPeer"> {{bestPeer.bestNumber}}</p>
        <p>Queued tx {{nodeInfo.extrinsics.length}}</p>
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

@Component
export default class Explorer extends Vue {
  public activeTab: any = 0;
  public conn: any = { chain: '', nodeName: '', nodeVersion: '', header: {}};
  public bestPeer: any = null;
  public bestPeerBlock: any = null;
  public api: any = null;
  public nodeInfo: any = {
    blockNumber: '', health: '', peers: '', extrinsics: '', session: '',
    totalIssuance: '', finalized: '', era: '',
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

  @Watch('activeTab')
  public async updateLocation() {
    // console.log(typeof this.activeTab);
    if (typeof this.activeTab === 'number') {
      this.$router.replace('/explorer/' + this.activeTab);
    }
  }

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
      const apiPendingExtrinsics = await (this as any).$http.api.rpc.author.pendingExtrinsics();
      this.nodeInfo.extrinsics = await apiPendingExtrinsics;
      const apiTotalIssuance = await (this as any).$http.api.query.balances.totalIssuance();
      this.nodeInfo.totalIssuance = await apiTotalIssuance;
      const apiFinalized = await (this as any).$http.api.derive.chain.bestNumberFinalized();
      this.nodeInfo.finalized = await apiFinalized;
    }
  }

  public async switchTab() {
    console.log(this.$route.params.tab);
    console.log(typeof Number(this.$route.params.tab));
    // if (typeof this.$route.params.tab === number) {
    this.activeTab = Number(this.$route.params.tab);
    // }
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
    this.switchTab();
  }
}
</script>