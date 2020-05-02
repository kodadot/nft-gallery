<template>
  <ItemCard>
    <div class="column is-1 proposal-index__main">
      {{ proposal.id | toNumber }}
    </div>
    <div class="column is-4 proposal-adress__overflow">
      <WithLabel label="Proposer"><div>{{ proposal.proposal.proposer | toString }}</div></WithLabel>
     
    </div>
    <div class="column is-4 proposal-adress__overflow">
      <WithLabel label="Beneficiary"><div>{{ proposal.proposal.beneficiary | toString }}</div></WithLabel>
      
    </div>
    <div class="column is-1">
      <WithLabel label="Payment"><Money :value="2000000000000000" /></WithLabel>
    </div>
    <div class="column is-1">
      <WithLabel label="Bond"><Money :value="100000000000000" /></WithLabel>
    </div>
    <div class="column is-1 ">
      <b-button class="proposal-button__action" is-primary disabled
        >To Council</b-button
      >
    </div>
  </ItemCard>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import Summary from './Summary.vue'
import ItemCard from '@/components/shared/wrapper/ItemCard.vue'
import Money from '@/components/shared/format/Money.vue'
import WithLabel from '@/components/shared/format/WithLabel.vue'

import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    Summary,
    ItemCard,
    Money,
    WithLabel
  }
})
export default class Proposal extends Vue {
  @Prop() proposal!: any;

}
</script>

<style scoped>
.proposal-index__main {
  font-size: 2em;
}

.proposal-button__action {
  float: right;
}

.proposal-adress__overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
