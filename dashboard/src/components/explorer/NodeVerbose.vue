<template>
  <div>
    <!-- <DisabledInput v-if="chainType"
      label="Chain Type" :value="chainType.toString()" /> -->
    <!-- <DisabledInput
      label="Health" :value="health.toString()" />
    <DisabledInput
      label="Version" :value="version.toString()" /> -->
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import DisabledInput from '@/components/shared/DisabledInput.vue';

@Component({
  components: {
    DisabledInput,
  }
})
export default class  extends Vue {

  private subs: any;
  private chainType: any = '';
  private health: any = '';
  private version: any = '';
  @Prop() public value!: any;

  public async mounted() {
  const { api } = Connector.getInstance();
    // this.subs.push(await api.rpc.system.chainType((value: any) => this.chainType = value));
    // this.subs.push(this.health = await api.rpc.system.health());
    this.subs.push(this.version = await api.rpc.system.version);
  }
  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub: any) => sub());
  }

  //   <!-- <NodeDetails :totalPeers="nodeInfo.health.peers"
  // :isSyncing="nodeInfo.health.isSyncing"
  // :ourBest="nodeInfo.blockNumber" -->
  // <!-- <p>Genesis Hash {{api.genesisHash}}</p> -->
  // <!-- <p>RuntimeVersion {{api.runtimeVersion}}</p>
  // <p>Library Info {{api.libraryInfo}}</p> -->
  // const apiPeers = await (this as any).$http.api.rpc.system.peers();
  // this.nodeInfo.peers = await apiPeers;
  // const apiHealth = await (this as any).$http.api.rpc.system.health();
  // this.nodeInfo.health = await apiHealth;
  // const apiPendingExtrinsics = await (this as any).$http.api.rpc.author.pendingExtrinsics();
  // this.nodeInfo.extrinsics = await apiPendingExtrinsics;
}
</script>
