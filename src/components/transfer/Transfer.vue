<template>
  <div class="columns mb-6">
    <div class="column is-6 is-offset-3">
      <section>
        <br />
        <Loader v-model="isLoading" :status="status" />
        <div class="box">
          <p class="title is-size-3">
            <!-- {{ $t('mint.context') }} -->
            Transfer {{ unit }}
          </p>

          <b-field>
            <Auth />
          </b-field>

          <b-field>
            {{ $t("general.balance") }}
            <Money :value="balance" inline />
          </b-field>

          <b-field>
            <AddressInput v-model="destinationAddress" />
          </b-field>

          <b-field>
            <BalanceInput @input="updateMeta" label="Price" />
          </b-field>

          <b-field>
            <b-button
              type="is-primary"
              icon-left="paper-plane"
              :loading="isLoading"
              :disabled="disabled"
              @click="submit"
              outlined
            >
              {{ $t("general.submit") }}
            </b-button>
          </b-field>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import TransactionMixin from '@/utils/mixins/txMixin';
import AuthMixin from '@/utils/mixins/authMixin';
import shouldUpdate from '@/utils/shouldUpdate';
import ChainMixin from '@/utils/mixins/chainMixin';
import { AccountInfo, DispatchError } from '@polkadot/types/interfaces';
import formatBalance from '@/utils/formatBalance';

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
    Loader: () => import('@/components/shared/Loader.vue'),
    AddressInput: () => import('@/components/shared/AddressInput.vue'),
    Money: () => import('@/components/shared/format/Money.vue')
  }
})
export default class Transfer extends Mixins(
  TransactionMixin,
  AuthMixin,
  ChainMixin
) {
  private balance: string = '0';
  protected destinationAddress: string = '';
  protected price: number = 0;

  get disabled(): boolean {
    return !this.destinationAddress || !this.price || !this.accountId;
  }

  protected updateMeta(value: number) {
    console.log(typeof value, value);
    this.price = value;
  }

  public async submit(): Promise<void> {
    showNotification('Dispatched');
    this.initTransactionLoader();

    try {
      const { api } = Connector.getInstance();
      const cb = api.tx.balances.transfer;
      const arg = [this.destinationAddress, this.price];

      const tx = await exec(this.accountId, '', cb, arg,
      txCb(
          async blockHash => {
            execResultValue(tx);
            const header = await api.rpc.chain.getHeader(blockHash);
            const blockNumber = header.number.toString();

            showNotification(
              `[${this.unit}] Transfered ${formatBalance(this.price, this.decimals, this.unit)} in block ${blockNumber}`,
              notificationTypes.success
            );

            this.destinationAddress = '';

            this.isLoading = false;
          },
          dispatchError => {
            execResultValue(tx);
            this.onTxError(dispatchError);
            this.isLoading = false;
          },
          res => this.resolveStatus(res.status)
        )
      );
    } catch (e) {
      console.error('[ERR: TRANSFER SUBMIT]', e);
      if (e instanceof Error) {
        showNotification(e.message, notificationTypes.danger);
      }
    }
  }

    protected onTxError(dispatchError: DispatchError): void {
    const { api } = Connector.getInstance();
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule);
      const { docs, name, section } = decoded;
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
        notificationTypes.danger
      );
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.danger
      );
    }

    this.isLoading = false;
  }

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      this.loadBalance();
    }
  }

  async loadBalance() {
    if (!this.accountId || !this.unit) {
      return;
    }

    await new Promise(a => setTimeout(a, 1000));
    const { api } = Connector.getInstance();

    try {
      const cb = api.query.system.account;
      const arg = this.accountId;
      const result: AccountInfo = await cb<AccountInfo>(arg);
      this.balance = result.data.free.toString();
    } catch (e) {
      console.error('[ERR: BALANCE]', e);
    }
  }
}
</script>

<style scoped>
</style>
