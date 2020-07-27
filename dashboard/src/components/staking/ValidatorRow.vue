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
      <WithLabel label="Stake Other"
        ><Money :value="stakingInfo.stakeOther"
      /></WithLabel>
    </div>
    <div class="column is-2">
      <WithLabel label="Stake Own"
        ><Money :value="stakingInfo.stakeOwn"
      /></WithLabel>
    </div>
    <div class="column is-2">
      <WithLabel label="Commission"
        ><div class="proposal-tip__reason">{{ stakingInfo.commission }}</div></WithLabel
      >
    </div>
    <div class="column is-1">
      <WithLabel label="Last #"
        ><div class="proposal-tip__reason">0</div></WithLabel
      >
    </div>
    <template v-if="nominatorsVisible" v-slot:additional>
      <Nominators :nominators="stakingInfo.nominators" />
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
import { StakingState, expandInfo } from './utils'
import Nominators from './Nominators.vue'

const components = {
  ItemCard,
  Money,
  WithLabel,
  Nominators
}

@Component({ components })
export default class ValidatorRow extends Vue {
  @Prop() public validatorId!: AccountId;
  private nominatorsVisible = false;
  private loading: boolean = false;
  private stakingInfo: StakingState = {
    nominators: []
  };

  public async mounted() {
    const { validatorId } = this;
    const { api } = Connector.getInstance()

    try {
      this.loading = true;
      const stakingInfo = await api.derive.staking.query(validatorId);
      this.stakingInfo = expandInfo(stakingInfo)
    } catch (e) {
      console.warn(e);
    } finally {
      this.loading = false;
    }
  }

  private handleNominatorsVisibility() {
    this.nominatorsVisible = !this.nominatorsVisible;
  }
}
</script>
