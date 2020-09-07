<template>
  <div class="card">
    <div class="card-content summary-content">
      <div>
        <div><b>Validators</b> {{ validators }}</div>
        <div><b>Nominators</b> {{ nominators }}</div>
      </div>
      <div>
        <div><b>Last Reward</b></div>
        <Money :value="lastReward" />
      </div>
      <div>
        <div><b>Total staked</b> <Money :value="totalStaked" /></div>
      </div>
      <div>
        <div><b>Total issuance</b> <Money :value="totalIssuance" /></div>
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
import Money from '@/components/shared/format/Money.vue'
import { BN_ZERO } from '@polkadot/util';

const components = { ProgressBar, Money }


@Component({ components })
export default class Summary extends Vue {
  @Prop() private readonly overview!: any;
  
  private totalIssuance: BN = BN_ZERO;

  public async mounted() {
    const { api } = Connector.getInstance()
    this.totalIssuance = await api.query.balances.totalIssuance();

  }

  get nominators() {
    return this.overview.nominators || 0
  }

  get validators() {
    return  this.overview.validators || 0
  }

  get totalStaked() {
    return this.overview.totalStaked || 0
  }

  get lastReward() {
    return this.overview.lastReward || 0
}

}


</script>

<style scoped>
.summary-content {
	display: flex;
	justify-content: space-between;
	flex-flow: wrap;
}

.summary-progressbar {
	flex-basis: 30em;
}
</style>
