<template>
  <div>

    recent
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
  }
})
export default class RecentBlocks extends Vue {

  private header: any = '';
  private subs: any[] = [];
  @Prop() public value!: any;

  public async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.subscribeNewHeads((value: any) => this.header = value));
  }
  
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>
