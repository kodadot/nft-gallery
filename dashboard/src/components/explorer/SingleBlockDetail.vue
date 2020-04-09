<template>
  <div>
<!-- {{ fetchedBlock }} -->
    <Card v-if="fetchedBlock && fetchedBlock.block && fetchedBlock.block.header"
      :nature="`🧊${fetchedBlock.block.header.number.toString()}`"
      :natureDesc="blockHash && blockHash.toString()"
      :type="fetchedBlock.block.header.parentHash.toString()"
      :extrinsicHash="fetchedBlock.block.header.extrinsicsRoot.toString()"
      :lifetime="fetchedBlock.block.header.stateRoot.toString()"
      :open="open"
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
  @Prop() public blockNumber!: any;
  @Prop({ default: false}) public open!: boolean;

  @Watch('$route.params.hash')
  public async loadExternalInfoByHash(hash: any) {
    const { api } = Connector.getInstance();
    if (hash) {
      this.subs.push(this.fetchedBlock = await api.rpc.chain.getBlock(this.hash));
      this.subs.push(this.blockHash = await api.rpc.chain.getBlockHash((this.fetchedBlock.block.header.number)));
    }
  }

  public async loadExternalInfoByBlockNumber(blockNumber: any) {
    const { api } = Connector.getInstance();
    if (blockNumber) {
      this.subs.push(this.blockHash = await api.rpc.chain.getBlockHash((blockNumber)));
      this.subs.push(this.fetchedBlock = await api.rpc.chain.getBlock(this.blockHash));    
    }
  }

  public async loadExternalInfoDefault() {
    const { api } = Connector.getInstance();
    this.subs.push(this.fetchedBlock = await api.rpc.chain.getBlock());
    this.subs.push(this.blockHash = await api.rpc.chain.getBlockHash());
  }

  public async mounted(): Promise<void> {
    if (this.hash) {
      this.loadExternalInfoByHash(this.hash);
    }
    if (this.blockNumber) {
      this.loadExternalInfoByBlockNumber(this.blockNumber);
    } else {
      this.loadExternalInfoDefault();
    }
  }
}
</script>
