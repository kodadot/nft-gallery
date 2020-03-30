<template>
  <div>
    <div v-if="sessionResolved" v-for="n in sessionResolved">
      <DisabledInput
        :label="n[0]" :value="n[1]" /> 
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
  private sessionResolved: any = [];
  private sessionInfo = 'api.derive.session?.info'
  private subs: any[] = [];
  @Prop() public value!: any;
  
  // get session() {
    
  //   return (value: any) => { 
      
  //     console.log('SummarySession -> getsession -> this.sessionData[value]', this.sessionData[value]);
  //     return this.sessionData[value]
  //   };
  // }

  // private async getSessionData(value: any) {
  //   const { api } = Connector.getInstance();
  //   if (api && this.sessionData) {

  //   }
  //   // return result.toString()
  // }

  @Watch('sessionData')
  private resolve(): void {
    for (const [key, value] of Object.entries(this.sessionData.info)) {
      this.sessionResolved.push([key, (value as any).toString()]);
    }
  }
  
  private async fetchSessionInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.session.info((value: any) => this.sessionData.info = value))
    // this.subs.push(await api.derive.session.sessionLength((value: any) => this.sessionData.Length = value))
    // this.subs.push(await api.derive.session.sessionProgress((value: any) => this.sessionData.Progress = value))
    // this.subs.push(await api.derive.session.currentIndex((value: any) => this.sessionData.currentIndex = value))
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
