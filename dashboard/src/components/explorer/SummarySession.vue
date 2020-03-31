<template>
  <div>
    <div v-if="entries">
      <DisabledInput
        label="Validators" :value="entries.validatorCount" /> 

      Epoch
      <progressbar :value="parseInt(entries.sessionProgress)" :max="parseInt(entries.sessionLength)" show-value></progressbar>
      
      Era
      <progressbar :value="parseInt(entries.eraProgress)" :max="parseInt(entries.eraLength)" show-value></progressbar>      
    </div>
    <div v-if="sessionResolved" v-for="n in sessionResolved">
      <DisabledInput
        :label="n[0]" :value="n[1]" /> 
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DisabledInput from '@/components/shared/DisabledInput.vue';
import Progressbar from '@/components/shared/ProgressBar.vue';
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    DisabledInput,
    Progressbar,
  }
})
export default class SummarySession extends Vue {
  private sessionData: any = {};
  private sessionResolved: any = {};
  private entries: any = {};
  private subs: any[] = [];
  @Prop() public value!: any;
  

  @Watch('this.sessionData.info')
  private resolve(): void {
    const arr = Object.entries(this.sessionData.info)
  
    const a = []
    for (const [key, value] of arr) {
      a.push([key, (value as any).toString()]);
    }

    const m = new Map(a)    
    const obj = Array.from(m).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {});
    
    this.sessionResolved = m
    this.entries = obj
    console.log('trigg')
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
