<template>
<div>
  Expolorer
    <div v-if="xx"> You are connected to chain {{xx.toString()}} </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Explorer extends Vue {
  public xx: any = '';

  get chain() {
      return this.xx;
  }

  public async mounted() {
    // console.log(await (this as any).$http.changeApiUrl('wss://poc3-rpc.polkadot.io/'));
    if ((this as any).$http.api) {
      const x = await (this as any).$http.api.rpc.system.chain();
      console.log(x);
      this.xx = await x.toString();
    }
    // (this as any).$http.api && console.log(await (this as any).$http.api.rpc.system.chain());
  }
}
</script>