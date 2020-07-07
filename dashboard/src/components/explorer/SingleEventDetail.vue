<template>
  <div>
    <CardRecentEvent 
      :header="`🎟 ${record.blockNumber}-${record.index}`"
      :content="`${JSON.stringify(record)}`"
      :item1="`${processRecord(record)}`"
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
  @Prop() private record!: any;

  private async processRecord(record: any) {
    const { api } = Connector.getInstance();
    // const meta = await api.registry.findMetaCall(record.index)
    console.log('SingleEventDetail -> processRecord -> meta', record);
    return ''
  }
}
</script>
