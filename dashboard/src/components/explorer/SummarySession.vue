<template>
  <div>
    <!-- <b-progress :value="sessionData.sessionLength"></b-progress> -->
    <!-- {{ fetchSessionInfo(sessionLength) }} -->
    a
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
  private sessionData: any = '';
  private ses
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
  //     this.subs.push(await `${api.derive.session.info}${value}`(value: any) => this.)
  //   }

  //   return result.toString()
  // }
  
  private async fetchSessionInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.session.info((value: any) => this.sessionData = value))
  }
  
  public async mounted() {
    this.fetchSessionInfo();
  }

  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>
