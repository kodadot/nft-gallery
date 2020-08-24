<template>
  <ItemCard>
    <div class="column is-4">
      <WithLabel label="Stash"
        ><div class="proposal-tip__reason">
          {{ validator.stashId | toString }}
        </div></WithLabel
      >
    </div>
    <div class="column is-4">
      <WithLabel label="Controller"
        ><div class="proposal-tip__reason">
          {{ validator.controllerId | toString }}
        </div></WithLabel
      >
    </div>
    <div class="column is-1.5">
      <WithLabel label="Rewards"
        ><div class="proposal-tip__reason">
          {{ validator.destination }}
        </div></WithLabel
      >
    </div>
    <div class="column is-2">
      <WithLabel label="Bonded"><Money :value="bonded" /></WithLabel>
    </div>
    <div class="column is-2">
      <WithLabel label="Session Keys"
        ><div class="proposal-tip__reason">
          {{ validator.hexSessionIdQueue }}
        </div></WithLabel
      >
    </div>
    <div class="column is-1.5">
      <WithLabel label="Commision"
        ><div class="proposal-tip__reason">
          {{ commission }}
        </div></WithLabel
      >
    </div>
    <div v-if="nominating.length" class="column is-1" @click="handleNominatorsVisibility">
      <WithLabel label="Nominating"
        ><div class="proposal-tip__reason">
          {{ nominating.length }}
        </div></WithLabel
      >
    </div>
    <div class="column is-1">
      <ActionModal
        :stashId="validator.stashId"
        :controllerId="validator.controllerId"
        :bonded="bonded"
        :nominating="nominating"
        :targetValidatorIds="targetValidatorIds"
        :isStopVisible="isStopVisible"
      />
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
import { StakerState } from './types'
import ActionModal from './ActionModal.vue'
import { notificationTypes, showNotification } from '@/utils/notification';
import exec from '@/utils/transactionExecutor';
import Nominators from '../Nominators.vue'

const components = {
  ItemCard,
  Money,
  WithLabel,
  ActionModal,
  Nominators
}

@Component({ components })
export default class ValidatorRow extends Vue {
  @Prop() public validator!: StakerState;
  @Prop() public index!: number;
  @Prop() private targetValidatorIds!: string[];

  private nominatorsVisible = false;

  get bonded() {
    return this.validator && this.validator.stakingLedger && this.validator.stakingLedger.total || 0
  }

  get nominating(): string[] {
    return this.validator && this.validator.nominating || []
  }

  get nominators(): [string, number][] {
    return this.nominating.map(v => [v, 0])
  }

  get commission() {
    const { validatorPrefs } = this.validator
    return validatorPrefs && validatorPrefs.commission || '0.00%'
  }

  private async handleStop() {
    try {
      const { validator, callback  } = this;
      const { controllerId: account } = validator 

      showNotification('Dispatched');
      const tx = await exec(account || '', null, callback, []);
      showNotification(tx, notificationTypes.success);
      console.timeStamp(`[handleStop] ${tx}`);
    } catch (e) {
      showNotification(e.message, notificationTypes.danger);
      console.error(e);
    }

  }

    get callback() {
    const { api } = Connector.getInstance();
    return api.tx.staking.chill;
  }


  get disabled() {
    return false;
  }

  private handleNominatorsVisibility() {
    this.nominatorsVisible = !this.nominatorsVisible;
  }

  get isStopVisible() {
    const { validator } = this
    return  validator.isStashNominating || validator.isStashValidating
  }

  
}
</script>


<style scoped>
.proposal-tip__reason {
  word-break: break-word;
}
</style>
