<template>
  <div id="summary">
    <DisabledInput
      label="Chain" :value="chainName.toString()" />
    <DisabledInput
      label="Best Block" :value="currentBlock.toString()" />
    <DisabledInput 
      label="Total Issuance" :value="totalIssuance.toString()" />
    <DisabledInput
      label="Finalized" :value="finalized.toString()" />
    <!-- <b-field label="EraProgress">
      <b-input :value="eraProgress" disabled></b-input>
    </b-field>
    <b-field label="EraLength">
      <b-input :value="eraLength" disabled></b-input>
    </b-field> 
    <b-field label="info">
      <b-input :value="info" disabled></b-input>
    </b-field> 
    <b-field label="sessionProgress">
      <b-input :value="sessionProgress" disabled></b-input>
    </b-field>  -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Connector from '@vue-polkadot/vue-api';
import DisabledInput from '@/components/shared/DisabledInput.vue';
@Component({
  components: {
    DisabledInput,
  },
})
export default class Summary extends Vue {
  private currentBlock: any = {};
  private chainName: any = {};
  private totalIssuance: any = {};
  private finalized: any = {};
  private eraLength: any = {};
  private eraProgress: any = {};
  private info: any = {};
  private sessionProgress: any = {};
  private subs: any[] = [];
  
  public async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.currentBlock = value));
    this.subs.push(await api.rpc.system.chain((value: any) => this.chainName = value));
    this.subs.push(await api.query.balances.totalIssuance((value: any) => this.totalIssuance = value));
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.finalized = value));
    // this.subs.push(await api.derive.session.info((value: any) => this.info = value));
    // this.subs.push(await api.derive.session.eraLength((value: any) => ``this.eraLength = value));
    // this.subs.push(await api.derive.session.eraProgress((value: any) => this.eraProgress = value));
    // this.subs.push(await api.derive.session.sessionProgress((value: any) => this.sessionProgress = value));
}

  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}

</script>
