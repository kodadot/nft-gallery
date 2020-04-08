<template>
  <div>
    <Card 
      :nature="lastHeader && `# ${lastHeader.number.toString()}`"
      :natureDesc="blockHash && blockHash.toString()"
      :type="lastHeader && lastHeader.parentHash.toString()"
      :extrinsicHash="lastHeader && lastHeader.extrinsicsRoot.toString()"
      :lifetime="lastHeader && lastHeader.stateRoot.toString()"
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

  private lastHeader: any = '';
  private blockHash: any = '';
  private subs: any[] = [];
  // @Prop() public value!: any;

  public async loadExternalInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.rpc.chain.getHeader((value: any) => this.lastHeader = value));
    this.subs.push(await api.rpc.chain.getBlockHash((value: any) => this.blockHash = value));
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
  }
}
</script>
