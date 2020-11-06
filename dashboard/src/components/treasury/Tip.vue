<template>
  <ItemCard>
    <div class="column is-3">
      <WithLabel label="Beneficiary"><div class="proposal-tip__reason"><Identity :address="tip.who" /></div></WithLabel>
     
    </div>
    <div class="column is-3">
      <WithLabel label="Finder"><div class="proposal-tip__reason"><Identity :address="tip.finder" /></div></WithLabel>
      
    </div>
    <div class="column is-1">
      <WithLabel label="Median Tip"><Money :value="medianTipValue" /></WithLabel>
    </div>
    <div class="column is-3">
      <WithLabel label="Reason"><div class="proposal-tip__reason">{{ reason | toString }}</div></WithLabel>
    </div>
    <div class="column is-1">
      <b-button class="proposal-button__action" is-primary disabled>
        Endorse
      </b-button>
    </div>
  </ItemCard>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ItemCard from '@/components/shared/wrapper/ItemCard.vue'
import Money from '@/components/shared/format/Money.vue'
import Identity from '@/components/shared/format/Identity.vue'
import WithLabel from '@/components/shared/format/WithLabel.vue'
import Connector from '@vue-polkadot/vue-api';
import { OpenTip, Balance } from '@polkadot/types/interfaces';
import { Option, Bytes } from '@polkadot/types';
import { hexToString } from '@polkadot/util';
import { emptyObject } from '@/utils/empty';
import BN from 'bn.js'
import { BN_ZERO } from '@polkadot/util';

@Component({
  components: {
    ItemCard,
    Money,
    WithLabel,
    Identity
  }
})
export default class Tip extends Vue {
  @Prop() public hash!: string;
  private tip: OpenTip = emptyObject<OpenTip>();
  private finderInfo: any = []
  private reason: string | null = null;
  private medianTipValue: BN = BN_ZERO;
  

  public async mounted() {
    console.warn(this.hash);
    
    const { api } = Connector.getInstance()
    const tip = await api.query.treasury.tips(this.hash)
    this.tip = tip.unwrapOr(emptyObject<OpenTip>())
    console.log(this.tip);

    const tipFees = this.tip.tips?.map(([ , value]) => value)
    .sort((a, b) => a.cmp(b))

    if (tipFees.length > 0) {
       const midIndex = Math.floor(tipFees.length / 2);

      this.medianTipValue =  tipFees.length % 2
        ? tipFees[midIndex]
        : tipFees[midIndex - 1].add(tipFees[midIndex]).divn(2)
    }
    
    const reasonText = await api.query.treasury.reasons(this.tip.reason)
    this.reason = reasonText.isSome 
    ? hexToString((reasonText).unwrap().toHex())
    : null;
  }

  private tipFeeReducer(accumulator: Balance, currentValue: Balance) {
    return accumulator.add(currentValue);
  } 

}
</script>

<style scoped>

.proposal-tip__reason {
  word-break: break-word;
}
</style>

