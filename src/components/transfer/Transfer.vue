<template>
  <div class="columns mb-6">
    <div class="column is-6 is-offset-3">
      <section>
        <br />
        <Loader v-model="isLoading" :status="status" />
        <router-link :to="`rmrk/u/${destinationAddress}`" class="linkartist"  v-if="this.$route.query.target">
          <b-icon icon="chevron-left" size="is-small" class="linkartist--icon"></b-icon>
           Go to artist's profile
        </router-link>
        <div class="box">
          <div class="info">
            <p class="title is-size-3">
            Transfer {{ unit }}
            </p>
            <span class="info--currentPrice" title='Current price'>${{this.$store.getters.getCurrentKSMValue}} </span>
          </div>

          <b-field>
            <Auth />
          </b-field>
          <div class="box--target-info" v-if="this.$route.query.target">
            Your donation will be sent to: 
            <a
              :href="`https://kusama.subscan.io/account/${this.$route.query.target}`"
              target="_blank"
              rel="noopener noreferrer"
              class="box--target-info--url"
            >
              <Identity ref="identity" :address="this.$route.query.target" inline />
            </a>
          </div>

          <b-field>
            {{ $t("general.balance") }}
            <Money :value="balance" inline />
          </b-field>

          <b-field>
            <AddressInput v-model="destinationAddress" />
          </b-field>
          <div class="box--container">
           <b-field>
            <BalanceInput v-model="price" label="Amount" :calculate="false" @input="onAmountFieldChange"/>
           </b-field>
           <b-field>
            <ReadOnlyBalanceInput v-model="usdValue" @input="onUSDFieldChange" labelInput="USD Value (approx)" label="USD" />
           </b-field>
          </div>

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
             <b-button
              v-if="transactionValue"
              type="is-success"
              class="tx"
              icon-left="external-link-alt"
              @click="getExplorerUrl"
              outlined
            >
              {{ $t("View Transaction")}} {{transactionValue.substring(0,6)}}{{'...'}}
            </b-button>
          </b-field>
          <div v-if="transactionValue && this.$route.query.donation || true">
            <div class="congrats">🎉 Congratulations for supporting      
             <Identity ref="identity" :address="this.$route.query.target" inline />
            </div>
            <b-button
              type="is-info"
              class="tweetBtn"
              icon-left="share-square"
              @click="shareInTweet"
              outlined
             >
             {{$t("Tweet about your awesome donation")}}
            </b-button>
          </div>
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
import { DispatchError } from '@polkadot/types/interfaces';
import { calculateBalance } from '@/utils/formatBalance';
import correctFormat from '@/utils/ss58Format';
import { checkAddress } from '@polkadot/util-crypto';
import { urlBuilderTransaction } from '@/utils/explorerGuide';
import { calculateUsdFromKsm, calculateKsmFromUsd } from '@/utils/calculation'
@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
    ReadOnlyBalanceInput: () => import('@/components/shared/ReadOnlyBalanceInput.vue'),
    Identity: () => import('@/components/shared/format/Identity.vue'),
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
  protected balance: string = '0';
  protected destinationAddress: string = '';
  protected transactionValue: string = '';
  protected price: number = 0;
  protected usdValue: number = 0;

  get disabled(): boolean {
    return !this.destinationAddress || !this.price || !this.accountId;
  }

  protected created() {
    this.checkQueryParams();
  }

  protected onAmountFieldChange() {
    /* calculating usd value on the basis of price entered */
    if (this.price) {
      this.usdValue = calculateUsdFromKsm(this.$store.getters.getCurrentKSMValue, this.price);
    } else {
      this.usdValue = 0;
    }
  }

  protected onUSDFieldChange() {
    /* calculating price value on the basis of usd entered */
    if (this.usdValue) {
      this.price = calculateKsmFromUsd(this.$store.getters.getCurrentKSMValue, this.usdValue);
    } else {
      this.price = 0;
    }
  }

  protected checkQueryParams() {
    const { query } = this.$route;

    if (query.target) {
      const [valid, err] = checkAddress(query.target as string, correctFormat(this.chainProperties.ss58Format));
      if (valid) {
        this.destinationAddress = query.target as string;
      }

      if (err) {
        showNotification(`Unable to parse target ${err}`,notificationTypes.warn);
      }
    }

    if (query.amount) {
      this.price = Number(query.amount);
    }

    if (query.usdamount) {
      this.usdValue = Number(query.usdamount);
      // getting ksm value from the usd value
      this.price = calculateKsmFromUsd(this.$store.getters.getCurrentKSMValue, this.usdValue);
    }
  }

  public async submit(): Promise<void> {
    showNotification(`${this.$route.query.target ? 'Sent for Sign' : 'Dispatched'}`);
    this.initTransactionLoader();

    try {
      const { api } = Connector.getInstance();
      const cb = api.tx.balances.transfer;
      const arg = [this.destinationAddress, calculateBalance(this.price, this.decimals)];

      const tx = await exec(this.accountId, '', cb, arg,
      txCb(
          async blockHash => {
            this.transactionValue = execResultValue(tx);
            const header = await api.rpc.chain.getHeader(blockHash);
            const blockNumber = header.number.toString();

            showNotification(
              `[${this.unit}] Transfered ${this.price} ${this.unit} in block ${blockNumber}`,
              notificationTypes.success
            );

            this.destinationAddress = '';
            this.price = 0;
            this.usdValue = 0;
            if (this.$route.query && !this.$route.query.donation) {
              this.$router.push(this.$route.path);
            }

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

  protected getUrl() {
    return urlBuilderTransaction(this.transactionValue,
      this.$store.getters.getCurrentChain, 'subscan');
  }

  protected getExplorerUrl() {
    const url =  this.getUrl();
    window.open(url, '_blank');
  }

  protected shareInTweet() {
    const text = 'I have just helped a really cool creator by donating. Check my donation proof:'
    const url = `https://twitter.com/intent/tweet?text=${text}&via=KodaDot&url=${this.getUrl()}`;
    window.open(url, '_blank');
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
      const result = await cb(arg);
      this.balance = (result as any).data.free.toString();
    } catch (e) {
      console.error('[ERR: BALANCE]', e);
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
   .info {
     display: flex;
     align-items: center;
     &--currentPrice {
        margin-bottom: 1.5rem;
        margin-left: 1.5rem;
        color: $primary;
        font-size: 1.5rem;
        font-weight: 600;
     }
    }
    .tx {
       margin-left: 1rem;
    }
    .tweetBtn {
       margin-top: 0.5rem;
    }
    .box {
      &--container {
        display: flex;
        justify-content: space-between;
        @media screen and (max-width: 1023px) {
         flex-direction: column;
        }
      }
      &--target-info {
        margin-bottom: 0.8rem;
        &--url {
          font-weight: bold;
        }
      }
    }
    .linkartist {
      padding-left: 1.25rem;
      display: flex;
      align-items: center; 
      &--icon {
        margin-right: 0.5rem;
      }
    }
    .congrats {
      font-size: 1.3rem;
    }
</style>
