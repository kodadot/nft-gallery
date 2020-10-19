<template>
  <div>
    <b-tabs type="is-toggle" class="payout-banner__tabs" @input="updateSelectedEra">
      <b-tab-item v-for="(era, index) in availableEras" :key="index" :label="era.text" />
    </b-tabs>
    <!-- <b-button disabled type="is-primary is-light">Payout All</b-button> -->
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { EraSelection } from './utils';

@Component({})
export default class PayoutBanner extends Vue {
  @Prop() public availableEras!: EraSelection[];
  @Prop() public value!: number;

  @Emit('input')
  updateSelectedEra(selectedEra: number) {
    console.log(selectedEra);
    
    return selectedEra;
  }
}
</script>

<style scoped>
/* TODO: Fix later */
/* @media only screen and (max-width: 600px) {
  .payout-banner__tabs {
    display: flex;
    flex-direction: row;
  }
} */

</style>
