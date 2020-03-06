<template>
  <div id="summary">
    <b-field label="Chain">
      <b-input :value="chainName" disabled></b-input>
    </b-field>
    <b-field label="Best Block">
      <b-input :value="currentBlock" disabled></b-input>
    </b-field>
    <b-field label="Total Issuance">
      <b-input :value="totalIssuance" disabled></b-input>
    </b-field>
    <b-field label="Finalized">
      <b-input :value="finalized" disabled></b-input>
    </b-field> 
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Connector from '@vue-polkadot/vue-api';

@Component({})
export default class Summary extends Vue {
  private currentBlock: any = {};
  private chainName: any = {};
  private totalIssuance: any = {};
  private finalized: any = {};
  private subs: any[] = [];
  
  public async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.currentBlock = value));

    this.subs.push(await api.rpc.system.chain((value: any) => this.chainName = value));

    this.subs.push(await api.query.balances.totalIssuance((value: any) => this.totalIssuance = value));
        
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.finalized = value));
}

  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}

</script>
