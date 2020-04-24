<template>
  <div>
    <DisabledInput 
      label="version" :value="version" />
    <DisabledInput 
      label="runtimeVersion" :value="runtimeVersion.toString()" />
    <DisabledInput 
      label="libraryInfo" :value="libraryInfo" />
    <DisabledInput 
      label="health" :value="health.toString()" />
    <DisabledInput 
      label="nodeRoles" :value="nodeRoles.toString()" />
    <DisabledInput 
      label="genesisHash" :value="genesisHash" /> 
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
export default class NodeVerbose extends Vue {
  private subs: any[] = [];
  private chainType: any = '';
  private health: any = '';
  private version: any = '';
  private runtimeVersion: any = '';
  private nodeRoles: any = '';
  private metadata: any = '';
  private libraryInfo: any = '';
  private genesisHash: any = '';

  public async mounted() {
  const { api } = Connector.getInstance();
    this.nodeRoles = await api.rpc.system.nodeRoles();
    this.version = await api.rpc.system.version();
    this.runtimeVersion = await api.runtimeVersion
    this.libraryInfo = await api.libraryInfo
    this.health = await api.rpc.system.health()
    this.genesisHash = await api.genesisHash.toString();
  }
}
</script>
