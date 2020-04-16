<template>
  <div>
    a
    {{block}}

    {{ payload }}
    <div v-if="block && block.block && block.block.extrinsics">
    
      <div v-for="ex in block.block.extrinsics">
      {{ex}}
      <CardExtrinsic 
        :header="findMetaCall(ex.method.callIndex)"
        :content="ex.method.args"
        
        :open="true" />
      </div>
      <!-- {{block.block.header.digest.logs}} -->
      <div v-for="(l, i) in block.block.header.digest.logs" :key="l">
        <CardEvents
          :header="l"
          content="aaa" />
      </div>
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
  private payload: any = {};
  private subs: any[] = [];
  @Prop() public hash!: any;
  @Prop({default: false}) public open!: boolean;

  public async loadExternalInfoByHash(hash: string) {
    const { api } = Connector.getInstance()
    this.subs.push(this.block = await api.rpc.chain.getBlock(this.hash));
    const { meta, method, section } = await api.registry.findMetaCall(this.block.block.extrinsics[0].method.callIndex)
    console.log('SingleBlockExtrinsicsDetail -> loadExternalInfoByHash -> meta, method, section', meta, method, section);
    
  }

  public async findMetaCall(callIndex: any): Promise<void> {
    const { api } = Connector.getInstance()
    const { meta, method, section } = await api.registry.findMetaCall(callIndex)
    return method
  } 

  @Watch('block')
  private resolve(): void { 
    const arr = Object.entries(this.block)

    const a: any[] = []
      for (const [key, value] of arr) {
        a.push([key, (value as any).toString()]);
      }

      const m = new Map(a)    
      const obj = Array.from(m)
        .reduce((acc, [ key, val ]) => Object
        .assign(acc, { [key as string]: val }), {});

    this.payload = obj
  }
  public async mounted(): Promise<void> {
    this.loadExternalInfoByHash(this.hash)
  }
}
</script>
