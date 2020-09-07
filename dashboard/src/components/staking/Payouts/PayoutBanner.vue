<template>
  <div>
    <b-tabs type="is-toggle">
      <b-tab-item v-for="era in availableEras" :key="era.value" :label="era.text" />
    </b-tabs>
    <!-- <b-button disabled type="is-primary is-light">Payout All</b-button> -->
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { EraSelection } from './utils';

@Component({})
export default class PayoutBanner extends Vue {
  @Prop() public availableEras!: EraSelection[];
}
</script>
