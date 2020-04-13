<template>
  <div>
    <h1>recent blocks</h1>
    <!-- {{newHeads}} -->
    <div v-for="header in newHeads" :key="header.stateRoot.toString()">
      <SingleBlockDetail :blockNumber="header.number" />
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import SingleBlockDetail from './SingleBlockDetail.vue';
@Component({
  components: {
    SingleBlockDetail
  }
})
export default class RecentBlocks extends Vue {

  private newHeads: any = [];
  private subs: any[] = [];
  @Prop() public value!: any;

  public async loadExternalInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.rpc.chain.subscribeFinalizedHeads((value: any) => {
      this.newHeads.unshift(value)
      if (this.newHeads.length > 20) {
        this.newHeads.pop()
      }
    }));
  }
  public async mounted() {
    this.loadExternalInfo()
  }
  
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>
