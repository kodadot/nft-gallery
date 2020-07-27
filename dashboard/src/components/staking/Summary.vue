<template>
  <div class="card">
    <div class="card-content summary-content">
      <div>
        <div><b>Validators</b> {{ validators }}</div>
        <div><b>Total</b> {{ totalValidators }}</div>
      </div>
      <div>
        <div><b>Waiting</b> {{ waiting }}</div>
        <div><b>Nominators</b> {{ nominators }}</div>
      </div>
      <div>
        <div><b>Last Block</b></div>
        <div>{{ lastBlock }}</div>
      </div>
			<div class="summary-progressbar">
				<label><b>Epoch</b></label>
				<ProgressBar :value="10" :max="100" />
			</div>
      <div class="summary-progressbar">
				<label><b>Era</b></label>
				<ProgressBar :value="activeEra" :max="currentEra" />
			</div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import BN from 'bn.js';
import ProgressBar from '@/components/shared/ProgressBar.vue';
import { DeriveStakingOverview } from '@polkadot/api-derive/types';

const components = { ProgressBar }


@Component({ components })
export default class Summary extends Vue {
  @Prop() private readonly overview!: DeriveStakingOverview;


  get totalValidators() {
    return this.overview.validatorCount || 0
  }

  get validators() {
    return this.overview.validators && this.overview.validators.length || 0
  }

  get activeEra() {
    return this.overview.activeEra || 0
  }

  get currentEra() {
    return this.overview.currentEra || 0
  }


  private waiting: number = 0;
  private nominators: number = 0;
  
  private lastBlock: number = 0;

 


}


</script>

<style scoped>
.summary-content {
	display: flex;
	justify-content: space-between;
	flex-flow: wrap;
}

.summary-progressbar {
	flex-basis: 15em;
}
</style>
