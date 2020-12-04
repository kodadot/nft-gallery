<template>
  <ItemCard>
    <div class="column is-5">
      <WithLabel label="Validator"
        ><div class="proposal-tip__reason">
          {{ validatorId | toString }}
        </div></WithLabel
      >
    </div>
     <div class="column is-2" @click="handleNominatorsVisibility">
      <WithLabel label="Eras">
        <div>1,245-1,251</div>
      </WithLabel>
    </div>
    <div class="column is-2">
      <WithLabel label="Available"
        ><Money :value="available"
      /></WithLabel>
    </div>
    <div class="column is-2">
      <WithLabel label="Remaining"
        ><div class="proposal-tip__reason">1 hr</div></WithLabel
      >
    </div>
    <div class="column is-1">
      <b-button type="is-primary" icon-right="credit-card" />
  
    </div>
    <template v-if="nominatorsVisible" v-slot:additional>
      <div>Show Additional data</div>
    </template>
  </ItemCard>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import ItemCard from '@/components/shared/wrapper/ItemCard.vue'
import Money from '@/components/shared/format/Money.vue'
import WithLabel from '@/components/shared/format/WithLabel.vue'
import { AccountId } from '@polkadot/types/interfaces';
import { DeriveStakingQuery } from '@polkadot/api-derive/types';
import { PayoutValidator } from './types';

import BN from 'bn.js'

const components = {
  ItemCard,
  Money,
  WithLabel
}

@Component({ components })
export default class ValidatorRow extends Vue {
  @Prop() public validator!: PayoutValidator;
  private nominatorsVisible = false;
  private loading: boolean = false;

  get validatorId(): string {
    return this.validator?.validatorId;
  }

  get available(): BN {
    return this.validator?.available
  }
}
</script>
