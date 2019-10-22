<template>
  <div id="explorer">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Chain Info">
        Last Block -><br>
        target -> 6s<br>
        total issuance<br>
        finalized<br>
        best<br>
        Chain name - {{conn.chainName}}<br>
        [recent blocks]<br>
      </b-tab-item>
      <b-tab-item label="Block Details">
        BlockNumber <p>{{nodeInfo.blockNumber}}</p>
        parentHash -><br>
        extrinsicsRoot -><br>
        StateRoot -><br>
        [extrinsics]<br>
        [events]<br>
        [logs]<br>
      </b-tab-item>
      <b-tab-item label="Node Info">
        Total Peers {{nodeInfo.health.peers}}<br>
        Syncing {{nodeInfo.health.isSyncing}}<br>
        Our best 
        <p>{{nodeInfo.blockNumber}}</p>
        Peer best 
        <!-- <b-button @click="sortBestPeerBlock">sort</b-button> -->
        <p v-if="bestPeer"
        > {{bestPeer.bestNumber}}</p>
        [[connected peers]]
        <!-- should be separate component -->
        <!-- <p>Peers {{nodeInfo.peers}}</p> -->
        <p>Pending Extrinsics </p>
        <!-- {{nodeInfo.extrinsics}} -->
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
import { ApiPromise, ApiRx, WsProvider } from '@polkadot/api';

@Component
export default class Explorer extends Vue {
  public activeTab: number = 2;
  public wsProviders: object = [
    {name: 'poc3-rpc.polkadot', value: 'wss://poc3-rpc.polkadot.io/'},
    {name: 'alex.unfrastructure', value: 'wss://alex.unfrastructure.io/public/ws'},
    {name: 'localhost:9444', value: 'ws://127.0.0.1:9944'}];
  public conn: any = { chain: '', nodeName: '', nodeVersion: '', header: {}};
  public bestPeer: any = null;
  public bestPeerBlock: any = null;
  public api: any = null;
  public nodeInfo: any = {
    blockNumber: '', health: '', peers: '', extrinsics: '',
  };
  public nodeInfoPeers: any = null;

  // You may have an infinite update loop in watcher with expression "nodeInfo.peers"
  @Watch('nodeInfo.peers')
  public async sortBestPeerBlock() {
    console.log(this.nodeInfo.peers.length);
    if (this.nodeInfo.peers.length) {
      this.bestPeer = this.nodeInfo.peers.sort((a: any, b: any): number => b.bestNumber.cmp(a.bestNumber))[0];
      this.bestPeerBlock = this.bestPeer.bestNumber;
    }
  }

    public async mounted(): Promise<void> {
    if ((this as any).$http.api) {
      const apiResponse = await (this as any).$http.api.rpc.system.chain();
      this.conn.chainName = await apiResponse.toString();
      const apiPeers = await (this as any).$http.api.rpc.system.peers();
      this.nodeInfo.peers = await apiPeers;
      const apiBestNumber = await (this as any).$http.api.derive.chain.bestNumber();
      this.nodeInfo.blockNumber = await apiBestNumber;
      const apiHealth = await (this as any).$http.api.rpc.system.health();
      this.nodeInfo.health = await apiHealth;
      // const apiPendingExtrinsics = await (this as any).$http.api.rpc.author.pendingExtrinsics();
      // this.nodeInfo.extrinsics = await apiPendingExtrinsics;
      // this.sortBestPeerBlock();
    }
    // this.apiInit();
    // this.timerNodeInfo();
  }
}
</script>