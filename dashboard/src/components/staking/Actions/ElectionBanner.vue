<template>
  <div>
    <div class="staking-actions-button__wrapper">
    <NewNominator class="staking-actions-button" />
    <b-button class="staking-actions-button" type="is-success" icon-left="plus" >Validator</b-button>
    <b-button class="staking-actions-button" type="is-danger" icon-left="plus" >Stash</b-button>
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import NewNominator from './NewNominator.vue'

const components = {
  NewNominator
}

@Component({ components })
export default class ElectionBanner extends Vue {

  private value2: any;
  @Prop() public value!: any;
}
</script>

<style scoped>
.staking-actions-button__wrapper {
  float: right;
  margin-bottom: 1em;
}

.staking-actions-button {
  margin-right: 0.5em;
}
</style>
