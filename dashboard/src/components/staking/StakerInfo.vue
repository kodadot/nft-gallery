<template>
  <div>
    <p>EtgM5E6pecndYpKCLkfYeRfKSmVxT1mVvaxceJFnhuKqTpG</p>
    <b-input placeholder="address of staker" v-model="address"></b-input>
    <b-button @click="fetch()">Fetch</b-button>
    <br>
    {{result}}
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';

@Component({})
export default class StakerInfo extends Vue {
  private address: any= '';
  private result: any = '';
  @Prop() public value!: any;

  private async fetch() {
    const { api } = Connector.getInstance();
    this.result = await api.derive.staking.query(this.address)
  }
}
</script>
