<template>
  <div>
    <b-field v-if="accountId" label="Action">
      <b-select
        placeholder="Select available action"
        :value="selectedAction"
        @input="handleSelect"
      >
        <option value="">None</option>
        <option v-for="action in actions" :value="action" :key="action">
          {{ action }}
        </option>
      </b-select>
    </b-field>
    <component v-if="showMeta" :is="showMeta" @input="updateMeta" />
    <b-button
      v-if="showSubmit"
      type="is-primary"
      icon-left="paper-plane"
      @click="submit"
    >
      Submit
    </b-button>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import exec, { execResultValue } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { getInstance, RmrkType } from '../service/RmrkService';
import { unpin } from '@/pinata';
import Consolidator from '../service/Consolidator';

const ownerActions = ['SEND', 'CONSUME', 'LIST'];
const buyActions = ['BUY'];

const needMeta: Record<string, string> = {
  SEND: 'AddressInput',
  LIST: 'BalanceInput'
};

const components = {
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  AddressInput: () => import('@/components/shared/AddressInput.vue') 
}

@Component({ components })
export default class AvailableActions extends Vue {
  @Prop() public currentOwnerId!: string;
  @Prop() public accountId!: string;
  @Prop() public price!: string;
  @Prop() public nftId!: string;
  @Prop() public imageHash!: string;
  @Prop() public metadataHash!: string;
  @Prop() public animationHash!: string;
  private selectedAction: string = '';
  private meta: string | number = '';
  private isLoading: boolean = false;
  private version: string = 'RMRK1.0.0';

  get actions() {
    return this.isOwner
      ? ownerActions
      : this.isAvailableToBuy
      ? buyActions
      : [];
  }

  get showSubmit() {
    return this.selectedAction && (!this.showMeta || this.meta);
  }

  get showMeta() {
    return needMeta[this.selectedAction];
  }

  get isOwner() {
    const { currentOwnerId, accountId } = this;
    return currentOwnerId && accountId && currentOwnerId === accountId;
  }

  get isAvailableToBuy() {
    const { price, accountId } = this;
    return accountId && Number(price) > 0;
  }

  private handleSelect(value: string) {
    this.selectedAction = value;
    this.meta = '';
  }

  private constructRmrk(): string {
    const { selectedAction, version, meta, nftId } = this;
    return `RMRK::${selectedAction}::${version}::${nftId}${
      meta ? '::' + meta : ''
    }`;
  }

  protected updateMeta(value: string | number) {
    this.meta = value;
  }

  protected async submit() {
    const { api } = Connector.getInstance();
    const rmrkService = getInstance();
    const rmrk = this.constructRmrk();
    try {
      showNotification(rmrk)
      console.log('submit', rmrk);
      const isBuy = this.selectedAction === 'BUY';
      const cb = isBuy ? api.tx.utility.batch : api.tx.system.remark
      const arg = isBuy ? [api.tx.system.remark(rmrk), api.tx.balances.transfer(this.currentOwnerId, this.price)] : rmrk
      const tx = await exec(this.accountId, '', cb, [arg]);
      showNotification(execResultValue(tx), notificationTypes.success)
      console.warn('TX IN', tx);
      const persisted = await rmrkService?.resolve(rmrk, this.accountId);
      if (this.selectedAction === 'CONSUME') {
        this.unpinNFT()
      }
      console.log(persisted)
      console.log('SAVED', persisted?._id);
      showNotification(`[TEXTILE] ${persisted?._id}`, notificationTypes.success)
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      console.error(e);
    }
  }

  protected unpinNFT() {
    [this.imageHash, this.metadataHash, this.animationHash]
    .forEach(async hash => {
      if (hash) {
        try {
          await unpin(hash)
        } catch (e) {
          console.warn(`[ACTIONS] Cannot Unpin ${hash} because: ${e}`)
        }
      }
    }) 

  }

  protected async consolidate(): Promise<boolean> {
    const rmrkService = getInstance();
    await rmrkService?.checkExpiredOrElseRefresh()

    if (!rmrkService) {
      console.warn('NO RMRK SERVICE, Live your life on the edge')
      return true;
    }

    const nft = await rmrkService?.getNFT(this.nftId)
    return Consolidator.consolidate(this.selectedAction, nft, this.currentOwnerId, this.accountId)
  }


}
</script>
