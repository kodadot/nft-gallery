<template>
  <div>
    <div v-if="entries && entries.validatorCount">
      <DisabledInput
        label="Validators" :value="entries.validatorCount" /> 

      <label><b>Epoch</b></label>
      <progressbar :value="parseInt(entries.sessionProgress)" :max="parseInt(entries.sessionLength)" show-value></progressbar>
      
      <label><b>Era</b></label>
      <progressbar :value="parseInt(entries.eraProgress)" :max="parseInt(entries.eraLength)" show-value></progressbar>      
    </div>
    <br>
    <Collapse :open="false" title="Feel Cute 💝👇" :content="sessionResolved" />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DisabledInput from '@/components/shared/DisabledInput.vue';
import Progressbar from '@/components/shared/ProgressBar.vue';
import Connector from '@vue-polkadot/vue-api';
import Collapse from '@/components/shared/Collapse.vue';

@Component({
  components: {
    DisabledInput,
    Progressbar,
    Collapse,
  }
})
export default class SummarySession extends Vue {
  private sessionData: any = {};
  private sessionResolved: any = {};
  private entries: any = {};
  private subs: any[] = [];
  @Prop({default: 0}) public currentBlock!: number;
  
  @Watch('currentBlock')
  private resolve(): void {
    if (this.sessionData && this.sessionData.info) {
      const arr = Object.entries(this.sessionData.info)
    
      const a: any[] = []
      for (const [key, value] of arr) {
        a.push([key, (value as any).toString()]);
      }

      const m = new Map(a)    
      const obj = Array.from(m)
        .reduce((acc, [ key, val ]) => Object
        .assign(acc, { [key as string]: val }), {});
      
      this.sessionResolved = m
      this.entries = obj
    }
  }
  
  private async fetchSessionInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.session.info((value: any) => this.sessionData.info = value))
}
  
  public async mounted() {
    this.fetchSessionInfo();
    // this.resolve();
  }

  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>
