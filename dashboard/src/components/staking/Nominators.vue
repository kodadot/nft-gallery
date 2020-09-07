<template>
  <div class="staking-validators-nominators-wrapper">
    <div v-for="nominator in nominators" :key="nominator[0]" class="staking-validators-nominator-item">
      <div><b>{{nominator[0] | shortAddress(10, -10) }}</b></div>
      <Money :value="nominator[1]" />
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Money from '@/components/shared/format/Money.vue'

const components = { Money }


@Component({ components })
export default class Nominators extends Vue {
  @Prop() public nominators!: any[];

}
</script>

<style scoped>
.staking-validators-nominators-wrapper {
  display: flex;
  flex-wrap: wrap
}

.staking-validators-nominator-item {
  margin: 0.3em;
}
</style>
