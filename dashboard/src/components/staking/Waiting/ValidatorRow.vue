<template>
  <ItemCard>
    <div class="column is-5">
      <WithLabel label="Validator"
        ><div class="proposal-tip__reason">
          {{ validatorId | toString }}
        </div></WithLabel
      >
    </div>
     <div class="column is-5" @click="handleNominatorsVisibility">
      <WithLabel label="Nominators"
        ><div class="proposal-tip__reason">{{ nominatorCount }}</div></WithLabel
      >
    </div>
    <div class="column is-2">
      <WithLabel label="Commission"
        ><div class="proposal-tip__reason">{{ commission }}</div></WithLabel
      >
    </div>
    <template v-if="nominatorsVisible" v-slot:additional>
      <Nominators :nominators="nominators" />
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
import { StakingState, expandInfo } from '../utils'
import Nominators from '../Nominators.vue'

const components = {
  ItemCard,
  Money,
  WithLabel,
  Nominators
}

@Component({ components })
export default class ValidatorRow extends Vue {
  @Prop() public validatorId!: AccountId;
  @Prop() public nominators!: any[];
  private nominatorsVisible = false;
  private loading: boolean = false;
  private stakingInfo: any = {}

  get nominatorCount() {
    return this.nominators && this.nominators.length || 0
  }

  get commission() {
    return this.stakingInfo.commission || '0.00%'
  }

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


<style scoped>
.proposal-tip__reason {
  word-break: break-word;
}
</style>
