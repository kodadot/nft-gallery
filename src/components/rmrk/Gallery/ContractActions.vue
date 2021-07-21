<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <div v-if="accountId" class="buttons">
      <b-button
        v-for="action in actions"
        :key="action"
        :type="iconType(action)[0]"
        @click="handleAction(action)"
      >
        {{ action }}
      </b-button>
    </div>
    <component
      class="mb-4"
      v-if="showMeta"
      :is="showMeta"
      @input="updateMeta"
    />
    <b-button
      v-if="showSubmit"
      type="is-primary"
      icon-left="paper-plane"
      @click="submit"
    >
      Submit {{ selectedAction }}
    </b-button>
  </div>
</template>

<script lang="ts" >
import { Component, Mixins, Prop, Emit } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import exec, {
  execResultValue,
  txCb,
  ContractParams,
  defaultContractOptions,
  contractExec
} from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { unpin } from '@/proxy';
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin';
import { somePercentFromTX } from '@/utils/support';
import shouldUpdate from '@/utils/shouldUpdate';
import nftById from '@/queries/nftById.graphql';
import { ContractPromise } from '@polkadot/api-contract';
import abi from '../Create/abi';
import { ContractTx } from '@polkadot/api-contract/base/types';
import TransactionMixin from '@/utils/mixins/txMixin';

const ownerActions = ['SEND', 'CONSUME', 'LIST'];
const buyActions = ['BUY'];

const needMeta: Record<string, string> = {
  SEND: 'AddressInput',
  LIST: 'BalanceInput'
};

type DescriptionTuple = [string, string] | [string];
const iconResolver: Record<string, DescriptionTuple> = {
  SEND: ['is-info is-dark'],
  CONSUME: ['is-danger'],
  LIST: ['is-dark'],
  BUY: ['is-success is-dark']
};

type Action = 'SEND' | 'CONSUME' | 'LIST' | 'BUY' | '';

const components = {
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  AddressInput: () => import('@/components/shared/AddressInput.vue'),
  Loader: () => import('@/components/shared/Loader.vue')
};

@Component({ components })
export default class AvailableActions extends Mixins(
  RmrkVersionMixin,
  TransactionMixin
) {
  @Prop() public currentOwnerId!: string;
  @Prop() public accountId!: string;
  @Prop() public price!: string;
  @Prop() public nftId!: string;
  @Prop() public contractId!: string;
  @Prop({ default: () => [] }) public ipfsHashes!: string[];
  private selectedAction: Action = '';
  private meta: string | number = '';

  get actions() {
    return this.isOwner
      ? ownerActions
      : this.isAvailableToBuy
      ? buyActions
      : [];
  }

  get showSubmit() {
    return this.selectedAction && (!this.showMeta || this.metaValid);
  }

  get metaValid() {
    if (typeof this.meta === 'number') {
      return this.meta >= 0;
    }

    return this.meta;
  }

  get showMeta() {
    return needMeta[this.selectedAction];
  }

  protected iconType(value: string) {
    return iconResolver[value];
  }

  protected handleAction(action: Action) {
    if (shouldUpdate(action, this.selectedAction)) {
      this.selectedAction = action;
    } else {
      this.selectedAction = '';
      this.meta = '';
    }
  }

  get isOwner() {
    console.log(
      '{ currentOwnerId, accountId }',
      this.currentOwnerId,
      this.accountId
    );

    return (
      this.currentOwnerId &&
      this.accountId &&
      this.currentOwnerId === this.accountId
    );
  }

  get isAvailableToBuy() {
    const { price, accountId } = this;
    return accountId && Number(price) > 0;
  }

  private handleSelect(value: Action) {
    this.selectedAction = value;
    this.meta = '';
  }

  get isBuy() {
    return this.selectedAction === 'BUY';
  }

  get isConsume() {
    return this.selectedAction === 'CONSUME';
  }

  get isList() {
    return this.selectedAction === 'LIST';
  }

  get isSend() {
    return this.selectedAction === 'SEND';
  }

  protected updateMeta(value: string | number) {
    console.log(typeof value, value);
    this.meta = value;
  }

  protected getAction(
    contract: ContractPromise
  ): ContractParams & { cb: ContractTx<'promise'> } {
    switch (this.selectedAction) {
      case 'LIST':
        return {
          params: [this.nftId, this.meta],
          options: defaultContractOptions,
          cb: contract.tx.list
        };
      case 'BUY':
        return {
          params: [this.nftId],
          options: {...defaultContractOptions, value: this.price },
          cb: contract.tx.buy
        };
      case 'SEND':
        return {
          params: [this.meta, this.nftId],
          options: defaultContractOptions,
          cb: contract.tx.transfer
        };
      case 'CONSUME':
        return {
          params: [this.nftId],
          options: defaultContractOptions,
          cb: contract.tx.burn
        };

      default:
        throw new ReferenceError('[Contract] no method');
    }
  }

  protected async submit() {
    this.isLoading = true;
    const { contractId} = this;
    const { api } = Connector.getInstance();

    try {
      const contractAddr = this.contractId;
      if (!contractAddr) {
        throw new ReferenceError('[NO CONTRACT]')
      }
      const contract = new ContractPromise(api, abi, contractAddr);
      const { cb, ...rest } = this.getAction(contract);

      const tx = await contractExec(
        this.accountId,
        '',
        cb,
        rest,
        txCb(
          async blockHash => {
            execResultValue(tx);
            const header = await api.rpc.chain.getHeader(blockHash);
            const blockNumber = header.number.toString();

            showNotification(
              `[NFT] Saved entries in block ${blockNumber}`,
              notificationTypes.success
            );

            const a = () => this.$emit('change');

            setTimeout(a, 1000);

            this.isLoading = false;
          },
          dispatchError => {
            execResultValue(tx);
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(
                dispatchError.asModule
              );
              const { documentation, name, section } = decoded;
              showNotification(
                `[ERR] ${section}.${name}: ${documentation.join(' ')}`,
                notificationTypes.danger
              );
            } else {
              showNotification(
                `[ERR] ${dispatchError.toString()}`,
                notificationTypes.danger
              );
            }

            this.isLoading = false;
          },
          res => this.resolveStatus(res.status),
          true
        )
      );
    } catch (e) {
      showNotification(`[ERR] ${e.message}`, notificationTypes.danger);
      console.error(e);
    }

    // check validity
    // PIN Image
    // Construct and pin JSON
  }

  protected unpinNFT() {
    this.ipfsHashes.forEach(async hash => {
      if (hash) {
        try {
          await unpin(hash);
        } catch (e) {
          console.warn(`[ACTIONS] Cannot Unpin ${hash} because: ${e}`);
        }
      }
    });
  }
}
</script>

