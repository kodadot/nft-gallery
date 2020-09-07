<template>
  <ItemCard>
    <div class="column is-1">
      <WithLabel label="Index"
        ><div class="proposal-tip__reason">{{ index }}</div></WithLabel
      >
    </div>
    <div class="column is-5">
      <WithLabel label="Validator"
        ><div class="proposal-tip__reason">
          {{ validator.accountId | toString }}
        </div></WithLabel
      >
    </div>
    <div class="column is-2">
      <WithLabel label="Nominators"
        ><div class="proposal-tip__reason">
          {{ validator.numNominators }}
        </div></WithLabel
      >
    </div>
     <div class="column is-1">
      <WithLabel label="Total"
        ><Money :value="validator.bondTotal"
      /></WithLabel>
    </div>
    <div class="column is-1">
      <WithLabel label="Own"
        ><Money :value="validator.bondOwn"
      /></WithLabel>
    </div>
    <div class="column is-1">
      <WithLabel label="Other"
        ><Money :value="validator.bondOther"
      /></WithLabel>
    </div>
    <div class="column is-1">
      <WithLabel label="Commission"
        ><Percent :value="0"
      /></WithLabel>
    </div>
  </ItemCard>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import ItemCard from '@/components/shared/wrapper/ItemCard.vue'
import Money from '@/components/shared/format/Money.vue'
import Percent from '@/components/shared/format/Percent.vue'
import WithLabel from '@/components/shared/format/WithLabel.vue'
import { AccountId } from '@polkadot/types/interfaces';
import { DeriveStakingQuery } from '@polkadot/api-derive/types';

const components = {
  ItemCard,
  Money,
  WithLabel,
  Percent
}

@Component({ components })
export default class ValidatorRow extends Vue {
  @Prop() public validator!: any;
  @Prop() public index!: number;

}
</script>


<style scoped>
.proposal-tip__reason {
  word-break: break-word;
}
</style>
