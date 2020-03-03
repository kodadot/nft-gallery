<template>
  <div class="card">
    <div class="card-content summary-content">
      <div>
        <div><b>Active Proposals</b> {{ activeProposals.length }}</div>
        <div><b>Total</b> {{ publicPropCount }}</div>
      </div>
      <div>
        <div><b>Referendums</b> {{ actualReferendums }}</div>
        <div><b>Total</b> {{ referendumCount }}</div>
      </div>
			<div class="summary-progressbar">
				<label><b>Launch Period</b></label>
				<ProgressBar :value="actualPeriod" :max="launchPeriod" />
			</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import BN from 'bn.js';
import ProgressBar from '@/components/shared/ProgressBar.vue';

const ZERO = new BN(0);

@Component({
	components: {
		ProgressBar,
	},
})
export default class Summary extends Vue {
  private activeProposals: any[] = [];
  private bestNumber: any = {};
  private nextActive: any = {};
  private publicPropCount: any = {};
  private referendumCount: any = {};
	private launchPeriod: any = 0;
	private actualPeriod: any = 0;
  private actualReferendums: any = {};
  private subs: any[] = [];


  public async mounted() {
    const { api } = Connector.getInstance();
    this.activeProposals = await api.derive.democracy.proposals();
    this.subs.push(await api.derive.chain.bestNumber(this.updateBar));
    this.nextActive = await api.query.democracy.lowestUnbaked();
    this.publicPropCount = await api.query.democracy.publicPropCount();
    this.referendumCount = await api.query.democracy.referendumCount();
    this.launchPeriod = api.consts.democracy.launchPeriod.toNumber();
    this.actualReferendums = this.referendumCount && this.nextActive ? this.referendumCount.sub(this.nextActive) : ZERO;
  }

  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }

  private updateBar(value: any) {
    const { api } = Connector.getInstance();
    this.bestNumber = value;
    this.actualPeriod = this.bestNumber.mod(api.consts.democracy.launchPeriod).addn(1).toNumber();
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
	flex-basis: 20em;
}
</style>
