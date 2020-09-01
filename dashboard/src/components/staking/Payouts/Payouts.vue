<template>
  <div>
    Payouts Works!
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import { BN_ZERO, isFunction } from '@polkadot/util';
import BN from 'bn.js';
import { getStakerPayouts, getOptions, EraSelection, getAvailable } from './utils' 
import getOwnEraRewards from './getOwnEraRewards'


const components = {

}

@Component({ components })
export default class Payouts extends Vue {

  private eraLength: BN = BN_ZERO;
  private historyDepth: BN = BN_ZERO;
  private _eraSelection: EraSelection[] = [];
  private myStashesIndex: number = 1;
  private ownValidators: any[] = [];
  private eraSelectionIndex: number = 0;


  public async mounted() {
    const { api } = Connector.getInstance();
    const { eraAt, hasOwnValidators, eraSelectionIndex, myStashesIndex, ownValidators } = this;
    const eraLength: BN = await api.derive.session.eraLength();
    const historyDepth: BN = await api.query.staking.historyDepth();
    this._eraSelection = await getOptions(eraLength, historyDepth);

    if (api.tx.staking.payoutStakers && hasOwnValidators) {
      this.myStashesIndex = 0;
    }
    
    
    const stakerPayoutsAfter: BN = await getStakerPayouts();
    const { allRewards, isLoadingRewards } = await getOwnEraRewards(eraAt(eraSelectionIndex), myStashesIndex ? undefined : ownValidators);

    // TODO: Add to private :)
    const { stashTotal, stashes, validators } =  getAvailable(allRewards, stakerPayoutsAfter);
    
    console.log('[DATA]', stashes)
  }

  public eraAt(index: number): number {
    return this._eraSelection[index].value
  }

  get hasOwnValidators(): boolean {
    return this.ownValidators.length !== 0;
  }


}
</script>
