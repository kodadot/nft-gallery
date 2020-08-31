<template>
  <div>
    <div class="staking-actions-button__wrapper">
      <NewNominator class="staking-actions-button" :targetValidatorIds="targetValidatorIds" />
      <NewValidator class="staking-actions-button" />
      <NewStash class="staking-actions-button" />
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

const components = {
  NewNominator: () => import('./NewNominator.vue'),
  NewValidator: () => import('./NewValidator.vue'),
  NewStash: () => import('./NewStash.vue')
};

@Component({ components })
export default class ElectionBanner extends Vue {
  @Prop() private targetValidatorIds!: string[];
}
</script>

<style scoped>
.staking-actions-button__wrapper {
  display: flex;
  float: right;
}

.staking-actions-button {
  margin-right: 0.5em;
}
</style>
