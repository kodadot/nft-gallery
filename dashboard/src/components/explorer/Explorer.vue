<template>
  <div id="explorer">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Chain Info">
      </b-tab-item>
      <b-tab-item label="Block Details">
      </b-tab-item>
      <b-tab-item label="Node Info">
        Total Peers {{nodeInfo.health.peers}}<br>
        Syncing {{nodeInfo.health.isSyncing}}<br>
        Our best 
        <p>{{nodeInfo.blockNumber}}</p>
        Peer best
        <p v-if="bestPeer"
        > {{bestPeer.bestNumber}}</p>
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

  // public async NodeInfoData(api) {
  //   try {
  //     [this.nodeInfo.blockNumber, this.nodeInfo.health,
  //     this.nodeInfo.peers, this.nodeInfo.extrinsics] = await Promise.all([
  //       api.derive.chain.bestNumber(),
  //       api.rpc.system.health(),
  //       api.rpc.system.peers(),
  //       api.rpc.author.pendingExtrinsics(),
  //     ]);

  //     return {};
  //   } catch (error) {
  //     console.error(error);
  //     return;
  //   }
  // }

  // public timerNodeInfo() {
  //   const timer = window.setInterval(() => {
  //     this.NodeInfoData();
  //     }, 9000);
  // }
  public sortBestPeerBlock() {
    // // console.log(peers)
    // if (this.nodeInfo.peers) {
      this.bestPeer = this.nodeInfo.peers.sort((a, b): number => b.bestNumber.cmp(a.bestNumber))[0];
      // this.bestPeerBlock = this.bestPeer.bestNumber
    // }
    // return;
  }

  // need make it in vue-api wrapper or vuex
  public async apiInit(): Promise<void> {
    const provider = new WsProvider('wss://poc3-rpc.polkadot.io/');
    // this line causes error Default via asOptional
    const api = await ApiPromise.create({provider});
    // const api = await ApiRx.create({provider}).toPromise();

    // this.api.genesisHash = api.genesisHash;
    // api.rpc.chain.subscribeNewHeads().subscribe((header: any) => {
    //   this.conn.header = header;
    // });

    [this.nodeInfo.blockNumber, this.nodeInfo.health,
    this.nodeInfo.peers, this.nodeInfo.extrinsics] = await Promise.all([
      api.derive.chain.bestNumber(),
      api.rpc.system.health(),
      api.rpc.system.peers(),
      api.rpc.author.pendingExtrinsics(),
    ]);
    this.sortBestPeerBlock();
  }

  public mounted(): void {
    this.apiInit();
    // this.timerNodeInfo();
  }
}
</script>