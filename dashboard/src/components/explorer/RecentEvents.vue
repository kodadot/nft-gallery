
<template>
  <div>
    <h1>recent events ({{ completeEvents.length }})</h1>
    <div v-for="(record, index) in completeEvents" :key="index">
      <SingleEventDetail :record="record" />
    </div>
    <!-- <div v-for="(r, i) in completeEvents" :key="i">
      {{ r }}
    </div> -->
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import Subscribe from '@/utils/mixins/subscribeMixin'
import Connector from '@vue-polkadot/vue-api';
import SingleEventDetail from './SingleEventDetail.vue';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

@Component({
  components: {
    SingleEventDetail
  }
})
export default class RecentEvents extends Mixins(Subscribe) {
  private numberOfShowedEvents: number = 20;
  private events: any[] = [];
  private completeEvents: any = [];
  @Prop() public value!: any;

  public async mounted() {
    const { api } = Connector.getInstance();
    this.subscribe(api.query.system.events, [], this.queEvents)
  }

  private async queEvents(records: any[]) {
    const { api } = Connector.getInstance();
    let prevBlockHash;
    let prevEventHash;
    const newEvents = records
      .map((record, index) => ({ index, record }))
      .filter(({ record: { event: { section }}}) => section !== 'system')
      .filter(({ record: { event: { method, section }}}) => !!method && !!section);
    
    const newEventHash = xxhashAsHex(stringToU8a(JSON.stringify(newEvents)));

    if (newEventHash !== prevEventHash && newEvents.length) {
      prevEventHash = newEventHash
      
      const header: any = await api.rpc.chain.getHeader();
      const blockNumber = header.number.unwrap();
      const blockHash = header.hash.toHex();
      

      if (blockHash !== prevBlockHash) {
        prevBlockHash = blockHash

        // const { meta, method, section } = await api.registry.findMetaCall(records.callIndex) 

        this.completeEvents = [...newEvents.map(({ index, record }) => ({
          blockHash,
          blockNumber,
          index,
          key: `${blockNumber.toNumber()}-${blockHash}-${index}`,
          record,
        })), 
        ...this.completeEvents].slice(0, this.numberOfShowedEvents)
        console.log('RecentEvents -> queEvents -> this.completeEvents', this.completeEvents);
      }
    }
  }
}
</script>
