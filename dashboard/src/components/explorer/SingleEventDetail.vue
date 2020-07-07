<template>
  <div>
    <CardRecentEvent 
      :header="`🎟 ${record.blockNumber}-${record.index} - ${record.record.event.method}.${record.record.event.section}`"
      :content="`${record.record.event.meta.documentation[0]}`"
    />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CardRecentEvent from '@/components/shared/CardRecentEvent.vue'
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    CardRecentEvent
  }
})
export default class SingleEventDetail extends Vue {
  private phase: any = '';
  private sanitizedEvent: any = '';
  @Prop() private record!: any;

  private async mounted(): Promise<void> {
    this.sanitizedEvent = this.record && this.record
      // .filter(({ record: { event: { method: any, section: any }}}) => !!method && !!section)
      // .map(({ blockHash, blockNumber, index, key, record}))
  }

  private async processRecord(record: any) {
    const { api } = Connector.getInstance();
    // const meta = await api.registry.findMetaCall(record.index)
    
    console.log('SingleEventDetail -> processRecord', record.record.event.method);
    
    console.log('SingleEventDetail -> processRecord -> record.record.event.section', record.record.event.section);
    // record.record.event.forEach((data, index) => {

    // })
    this.phase = record.phase
    
  }
}
</script>
