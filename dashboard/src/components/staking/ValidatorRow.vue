<template>
  <ItemCard>
    {{ validatorId }}  
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

const components = {
  ItemCard,
  Money,
  WithLabel
}

@Component({ components })
export default class ValidatorRow extends Vue {
  @Prop() public validatorId!: AccountId;
  private loading: boolean = false;
  private validatorInfo: DeriveStakingQuery | any = {};

  public async mounted() {
    const { validatorId } = this;
    const { api } = Connector.getInstance()

    try {
     this.loading = true;
     this.validatorInfo =  await api.derive.staking.query(validatorId);
    } catch (e) {
      console.warn(e);
    } finally {
      this.loading = false;
    }

    
  }
}
</script>
