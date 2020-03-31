<template>
  <div>
    <div v-if="sessionResolved" v-for="n in sessionResolved">
      <DisabledInput
        :label="n[0]" :value="n[1]" /> 
    </div>
    <div v-if="sessionResolved">
      <!-- <b-progress :value="sessionResolved.sessionProgress" :max="sessionResolved.sessionLength" show-value></b-progress> -->
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DisabledInput from '@/components/shared/DisabledInput.vue';
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    DisabledInput,
  }
})
export default class SummarySession extends Vue {
  private sessionData: any = {};
  private sessionResolved: any = {};
  private subs: any[] = [];
  @Prop() public value!: any;
  

  @Watch('sessionData')
  private resolve(): void {
    const arr = Object.entries(this.sessionData.info)
  
    const a = []
    for (const [key, value] of arr) {
      a.push([key, (value as any).toString()]);
    }

    const m = new Map(a)    
    console.log('SummarySession -> resolve -> m', m);
    this.sessionResolved = m
  }
  
  private async fetchSessionInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.session.info((value: any) => this.sessionData.info = value))
}
  
  public async mounted() {
    this.fetchSessionInfo();
    this.resolve();
  }

  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>
