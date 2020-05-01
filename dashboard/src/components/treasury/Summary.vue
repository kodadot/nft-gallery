<template>
  <SummaryCard>
    <div>
      <WithLabel label="Proposals ">{{ proposalCount }}</WithLabel>
    <WithLabel label="Approved ">{{ approvalCount }}</WithLabel>
    </div>
    <WithLabel label="Avaible"><Money :value="avaible" /></WithLabel>
    <WithLabel label="Spend Period" class="summary-progressbar">
      <ProgressBar :value="actualPeriod" :max="spendPeriod" />
    </WithLabel>
  </SummaryCard>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SummaryCard from '@/components/shared/wrapper/SummaryCard.vue'
import Money from '@/components/shared/format/Money.vue'
import ProgressBar from '@/components/shared/ProgressBar.vue'
import WithLabel from '@/components/shared/format/WithLabel.vue'
import { formatNumber, stringToU8a } from '@polkadot/util';
import Connector from '@vue-polkadot/vue-api';
import BN from 'bn.js';
import { toNumber } from '@/utils/formats'

const TREASURY_ACCOUNT = stringToU8a('modlpy/trsry'.padEnd(32, '\0'));
const ZERO = new BN(0);

(window as any).B = new BN(0);

@Component({
  components: {
    SummaryCard,
    Money,
    ProgressBar,
    WithLabel
  }
})
export default class Summary extends Vue {
  @Prop({default: 0}) readonly approvalCount: number | string | undefined;
  @Prop({default: 0}) readonly proposalCount: number | string | undefined;

  private bestNumber: BN = ZERO;
  private spendPeriod: BN = ZERO;
  private actualPeriod: BN = ZERO;
  private avaible: string = '0';
  private subs: any[] = [];

  public async mounted() {
    const { api } = Connector.getInstance();
    this.spendPeriod = api.consts.treasury.spendPeriod;
    this.subs.push(await api.derive.chain.bestNumber(this.updateBar));
    const treasuryBalance = await api.derive.balances.account(TREASURY_ACCOUNT as any);
    this.avaible = treasuryBalance.freeBalance.toString();

  }

   private updateBar(value: BN) {
    const { api } = Connector.getInstance();
    this.bestNumber = value;
    this.actualPeriod = value.mod(this.spendPeriod);
  }

  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }

}
</script>

<style scoped>
.summary-progressbar {
  flex-basis: 20em;
}
</style>
