<template>
  <ItemCard>
    <div class="column is-3">
      <WithLabel label="Stash"
        ><div class="proposal-tip__reason">
          {{ validator.stashId | toString }}
        </div></WithLabel
      >
    </div>
    <div class="column is-3">
      <WithLabel label="Controller"
        ><div class="proposal-tip__reason">
          {{ validator.controllerId | toString }}
        </div></WithLabel
      >
    </div>
    <div class="column is-1">
      <WithLabel label="Rewards"
        ><div class="proposal-tip__reason">
          {{ validator.destination }}
        </div></WithLabel
      >
    </div>
    <div class="column is-1">
      <WithLabel label="Bonded"><Money :value="bonded" /></WithLabel>
    </div>
    <div class="column is-2">
      <WithLabel label="Session Keys"
        ><div class="proposal-tip__reason">
          {{ validator.hexSessionIdQueue }}
        </div></WithLabel
      >
    </div>
    <div class="column is-1">
      <WithLabel label="Commision"
        ><div class="proposal-tip__reason">
          {{ commission }}
        </div></WithLabel
      >
    </div>
    <div class="column is-2">
      
      <b-button class="staking-actions-button" type="is-primary" icon-left="stop" @click="handleStop">Stop</b-button>
      
    </div>
    <div class="column is-1">
      <ActionModal
        :stashId="validator.stashId"
        :controllerId="validator.controllerId"
        :bonded="bonded"
      />
    </div>
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

const components = {
  ItemCard,
  Money,
  WithLabel,
  ActionModal
}

@Component({ components })
export default class ValidatorRow extends Vue {
  @Prop() public validator!: StakerState;
  @Prop() public index!: number;

  get bonded() {
    return this.validator && this.validator.stakingLedger && this.validator.stakingLedger.total || 0
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

  
}
</script>


<style scoped>
.proposal-tip__reason {
  word-break: break-word;
}
</style>
