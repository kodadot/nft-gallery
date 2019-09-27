<template>
  <div id="explorer">
    <p>Recent Block {{conn.header.number}}</p>
    <p>Genesis Hash {{api.genesisHash}}</p>
    <p>RuntimeVersion {{api.runtimeVersion}}</p>
    <p>Library Info {{api.libraryInfo}}</p>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// import { SubmittableExtrinsic, QueryableStorageEntry } from '@polkadot/api/promise/types';
import { ApiPromise, WsProvider } from '@polkadot/api';

@Component({})
export default class Explorer extends Vue {
  public wsProviders: object = [
    {name: 'poc3-rpc.polkadot', value: 'wss://poc3-rpc.polkadot.io/'},
    {name: 'alex.unfrastructure', value: 'wss://alex.unfrastructure.io/public/ws'},
    {name: 'localhost:9444', value: 'ws://127.0.0.1:9944'}];
  public conn: any = { chain: '', nodeName: '', nodeVersion: '', header: {}};

  public api: any = '';
  public async apiInit(): Promise<void> {
    const wsprovider = new WsProvider('wss://poc3-rpc.polkadot.io/');
    this.api = await ApiPromise.create({provider: wsprovider});

    this.api.rpc.chain.subscribeNewHeads((header: any) => {
      this.conn.header = header;
    });
  }

  public mounted(): void {
    this.apiInit();
  }
}
</script>