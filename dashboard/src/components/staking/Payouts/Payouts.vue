<template>
  <div>
    <PayoutBanner :availableEras="eraSelection" v-model="eraSelectionIndex" />
    <div>
      <SectionTitle class="staking-actions__title" title="Payout/Stash" />
    </div>
    <EmptyGuard :array="stashes" label="Stashes">
      <StashRow v-for="(stash, index) in stashes" :key="index" :stash="stash" />
    </EmptyGuard>
    <div>
      <SectionTitle class="staking-actions__title" title="Payout/Validator" />
    </div>
    <TableOverview :validator="validators" /> 
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import { BN_ZERO, isFunction } from '@polkadot/util';
import BN from 'bn.js';
import { getStakerPayouts, getOptions, EraSelection, getAvailable } from './utils' 
import getOwnEraRewards from './getOwnEraRewards'
import PayoutBanner from './PayoutBanner.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue';
import { PayoutStash, PayoutValidator } from './types';
import TableOverview from './TableOverview.vue';
import EmptyGuard from '@/components/shared/wrapper/EmptyGuard.vue'
import StashRow from './StashRow.vue'

const components = {
  PayoutBanner,
  SectionTitle,
  EmptyGuard,
  StashRow,
  TableOverview
}

@Component({ components })
export default class Payouts extends Vue {

  private eraLength: BN = BN_ZERO;
  private historyDepth: BN = BN_ZERO;
  private eraSelection: EraSelection[] = [];
  private myStashesIndex: number = 1;
  private ownValidators: any[] = [];
  private eraSelectionIndex: number = 0;
  private stashes: PayoutStash[] = [];
  private validators: PayoutValidator[] = [];

  public async mounted() {
    const { api } = Connector.getInstance();
    const { hasOwnValidators, calculateEraRewards, eraSelectionIndex  } = this;
    const eraLength: BN = await api.derive.session.eraLength();
    const historyDepth: BN = await api.query.staking.historyDepth();
    this.eraSelection = await getOptions(eraLength, historyDepth);

    if (api.tx.staking.payoutStakers && hasOwnValidators) {
      this.myStashesIndex = 0;
    }

    await calculateEraRewards(eraSelectionIndex);
  }

  public eraAt(index: number): number {
    return this.eraSelection[index]?.value
  }

  get hasOwnValidators(): boolean {
    return this.ownValidators.length !== 0;
  }

  @Watch('eraSelectionIndex')
  selectedNewEra(newValue: number, oldValue: number) {
    this.calculateEraRewards(newValue);
  }

  private async calculateEraRewards(eraIndex: number) {
    const { eraAt, hasOwnValidators, myStashesIndex, ownValidators } = this;

    const stakerPayoutsAfter: BN = await getStakerPayouts();
    const { allRewards, isLoadingRewards } = await getOwnEraRewards(eraAt(eraIndex), myStashesIndex ? undefined : ownValidators);

    const { stashTotal, stashes, validators } =  getAvailable(allRewards, stakerPayoutsAfter);
    this.stashes = stashes || [];
    this.validators = validators || [];

    console.log('[PAYOUTS] rewards', { stashes, validators })
  }


}
</script>

<style scoped>
.staking-actions__title {
  margin-bottom: 1em;
}
</style>
