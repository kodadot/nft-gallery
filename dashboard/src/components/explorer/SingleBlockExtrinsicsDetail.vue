<template>
  <div>
    <div v-if="block && block.block && block.block.extrinsics">
      <div v-if="decodedData">
        <div v-for="e in decodedData">
          <CardExtrinsic
            :header="`${e.section}.${e.method}`"
            :content="`${e.meta.documentation[0]}`"
            :item1header="`${e.meta.args[0].name}.${e.meta.args[0].type}`"
            :item1="`${e.e.method.args}`" 
            item2header="extrinsic hash"
            :item2="`${e.e.hash.toHex()}`"
            item3header="lifetime"
            item3="immortal" />
        </div>
        <br>
        <!-- <div v-for="(v, n, i) in block.block.header.digest.logs">
          <CardExtrinsic
            :header="`${v}`"
            :open="true" />
        </div> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CardExtrinsic from '@/components/shared/CardExtrinsic.vue';
import CardEvents from '@/components/shared/CardEvents.vue';
import Connector from '@vue-polkadot/vue-api';
// import { Struct, Tuple, Raw, Vec, getTypeDef } from '@polkadot/types';

@Component({
  components: {
    CardExtrinsic,
    CardEvents,
  }
})
export default class SingleBlockExtrinsicsDetail extends Vue {
  private block: any = '';
  private decodedData: any[] = [];
  private decodedLogs: any[] = [];
  private subs: any[] = [];
  @Prop() public hash!: any;
  @Prop({default: false}) public open!: boolean;

  @Watch('$route.params.hash')
  public async loadExternalInfoByHash(hash: string) {
    const { api } = Connector.getInstance()
    this.subs.push(this.block = await api.rpc.chain.getBlock(this.hash));
  }

  @Watch('block')
  private async decode(): Promise<void> {
    if (this.block && this.block.block && this.block.block.extrinsics) {
      const { api } = Connector.getInstance()
      this.decodedData = [];
      for (const e of this.block.block.extrinsics) {
        const { meta, method, section } = await api.registry.findMetaCall(e.method.callIndex)
        this.decodedData.push({e, meta, method, section})
      }
    }
  }

  @Watch('block')
  private async decodeLogs(): Promise<void> {
    if(this.block && this.block.block 
    && this.block.block.header 
    && this.block.block.header.digest.logs) {
      const logs = this.block.block.header.digest.logs
      // console.log('SingleBlockExtrinsicsDetail -> logs', logs);
      // const decode = Object.keys(this.block.block.header.digest.logs)
      // console.log('SingleBlockExtrinsicsDetail -> decode', decode);
    }
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfoByHash(this.hash)
  }
}
</script>
