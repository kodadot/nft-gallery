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
        <div>{{ currentBlock | toString }}</div>
      </div>
			<div class="summary-progressbar">
				<label><b>Epoch</b></label>
				<ProgressBar :value="sessionProgress" :max="sessionLength" />
			</div>
      <div class="summary-progressbar">
				<label><b>Era</b></label>
				<ProgressBar :value="eraProgress" :max="eraLength" />
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
import { BlockNumber } from '@polkadot/types/interfaces';
import { DeriveSessionProgress } from '@polkadot/api-derive/types';

const components = { ProgressBar }


@Component({ components })
export default class Summary extends Vue {
  @Prop() private readonly overview!: DeriveStakingOverview;
  @Prop() private readonly currentBlock!: BlockNumber;
  @Prop() private readonly session!: DeriveSessionProgress;
  @Prop() private readonly waiting!: number;


  get totalValidators() {
    return this.overview.validatorCount || 0
  }

  get validators() {
    return this.overview.validators?.length || 0
  }

  get lastBlock() {
    return this.currentBlock?.toString || 0;
  }

  get sessionLabel(): string {
    return this.session?.isEpoch ? 'Epoch' : 'Session'
  }

  get sessionLength() {
    return this.session?.sessionLength?.toNumber()
  }

  get sessionProgress() {
    return this.session?.sessionProgress?.toNumber()
  }

  get eraLength() {
    return this.session?.eraLength?.toNumber();
  }

  get eraProgress() {
    return this.session?.eraProgress?.toNumber();
  }

  private nominators: number = 0;
  
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
