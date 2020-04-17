<template>
  <div>
    <!-- {{block}} -->
    <div v-if="block && block.block && block.block.extrinsics">
      <!-- _
      {{ decodedData }}
      _ -->
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
      </div>
      <!-- <div v-for="ex in block.block.extrinsics"> -->
      <!-- {{ex}} -->
      <!-- <CardExtrinsic 
        :header="findMetaCall(ex.method.callIndex)"
        :content="ex.method.args"
        
        :open="true" /> -->
      <!-- </div> -->
      <!-- {{block.block.header.digest.logs}} -->
      <!-- <div v-for="(l, i) in block.block.header.digest.logs" :key="l">
        <CardEvents
          :header="l"
          content="aaa" />
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CardExtrinsic from '@/components/shared/CardExtrinsic.vue';
import CardEvents from '@/components/shared/CardEvents.vue';
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    CardExtrinsic,
    CardEvents,
  }
})
export default class SingleBlockExtrinsicsDetail extends Vue {
  private block: any = '';
  private decodedData: any[] = [];
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
    const { api } = Connector.getInstance()
    this.decodedData = [];
    for (const e of this.block.block.extrinsics) {
      const { meta, method, section } = await api.registry.findMetaCall(e.method.callIndex)
      this.decodedData.push({e, meta, method, section})
    }
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfoByHash(this.hash)
  }
}
</script>
