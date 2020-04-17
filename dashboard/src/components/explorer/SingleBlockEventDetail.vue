<template>
  <div>
    <div v-for="event in events" :key="event.phase.ApplyExtrinsic">
      <CardEvents 
        header="system.ExtrinsicSuccess" 
        :content="event.event.data[0]"
        :open="open"
      />
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import CardEvents from '@/components/shared/CardEvents.vue'

@Component({
  components: {
    CardEvents,
  }
})
export default class SingleBlockEventDetail extends Vue {
  
  private payload: any = {};
  private events: any = [];
  private subs: any[] = [];
  @Prop() public hash!: string;
  @Prop({ default: false}) public open!: boolean;

  @Watch('$route.params.hash')
  public async loadExternalInfoByHash(hash: string) {
    const { api } = Connector.getInstance()
    this.subs.push(this.events = await api.query.system.events.at(this.hash));
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfoByHash(this.hash);
  }
}
</script>
