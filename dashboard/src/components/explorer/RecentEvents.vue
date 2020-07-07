
<template>
  <div>
    <h1>recent events ({{ events.length }})</h1>
    <div v-for="record in events" :key="record.record">
      <SingleEventDetail :record="record" />
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import Subscribe from '@/utils/mixins/subscribeMixin'
import Connector from '@vue-polkadot/vue-api';
import SingleEventDetail from './SingleEventDetail.vue';

@Component({
  components: {
    SingleEventDetail
  }
})
export default class RecentEvents extends Mixins(Subscribe) {
  private numberOfShowedEvents: number = 10;
  private events: any[] = [];
  @Prop() public value!: any;

  public async mounted() {
    const { api } = Connector.getInstance();
    this.subscribe(api.query.system.events, [], this.queEvents)
  }

  private queEvents(record: any[]) {
    this.events.unshift(record)
    if (this.events.length > this.numberOfShowedEvents) {
      this.events.pop()
    } 
  }
}
</script>
