<template>
  <div>
    <div class="staking-actions-button__wrapper">
    <b-button class="staking-actions-button" type="is-primary" icon-left="plus" >Nominator</b-button>
    <b-button class="staking-actions-button" type="is-success" icon-left="plus" >Validator</b-button>
    <b-button class="staking-actions-button" type="is-danger" icon-left="plus" >Stash</b-button>
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';


@Component
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
