<template>
<div>
  Expolorer
    <div v-if="chainName"> You are connected to chain {{chainName.toString()}} </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Explorer extends Vue {
  public chainName: any = '';

  public async mounted() {
    if ((this as any).$http.api) {
      const apiResponse = await (this as any).$http.api.rpc.system.chain();
      this.chainName = await apiResponse.toString();
    }
  }
}
</script>