<template>
  <div>
<!-- {{ fetchedBlock }} -->
    <Card v-if="fetchedBlock && fetchedBlock.block && fetchedBlock.block.header"
      :nature="`🧊${fetchedBlock.block.header.number.toString()}`"
      :natureDesc="blockHash && blockHash.toString()"
      :type="fetchedBlock.block.header.parentHash.toString()"
      :extrinsicHash="fetchedBlock.block.header.extrinsicsRoot.toString()"
      :lifetime="fetchedBlock.block.header.stateRoot.toString()"
      :open="true"
    />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import Card from '../shared/Card.vue';

@Component({
  components: {
    Card,
  }
})
export default class SingleBlockDetail extends Vue {
  private getBlock: any = null;
  private fetchedBlock: any = {}
  private blockHash: any = '';
  private subs: any[] = [];
  @Prop() public hash!: any;

  public async loadExternalInfo() {
    const { api } = Connector.getInstance();
    if (this.hash) {
      this.subs.push(this.fetchedBlock = await api.rpc.chain.getBlock(this.hash));
      this.subs.push(this.blockHash = await api.rpc.chain.getBlockHash((this.fetchedBlock.block.header.number)));
    } else {
      this.subs.push(this.fetchedBlock = await api.rpc.chain.getBlock());
      this.subs.push(this.blockHash = await api.rpc.chain.getBlockHash());
    }
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
  }
}
</script>
