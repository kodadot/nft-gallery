<template>
  <div class="columns mb-6">
    <div class="column is-6 is-offset-3">
      <section>
        <br />
        <Loader v-model="isLoading" :status="status" />
        <div class="box">
          <p class="title is-size-3">
            {{ $t('identity.set') }}
          </p>
          <b-field>
            <Identity
              class="subtitle has-text-weight-bold"
              ref="identity"
              :address="accountId"
              inline
              emit
              @change="handleIdentity"
            />
          </b-field>
          <b-field label="Handle">
            <b-input
              placeholder="My On-Chain Name"
              v-model="identity.display"
              required
              :validation-message="$t('identity.handleRequired')"
            >
            </b-input>
          </b-field>
          <b-field label="Name">
            <b-input placeholder="Full Legal Name" v-model="identity.legal">
            </b-input>
          </b-field>
          <b-field label="email">
            <b-input
              placeholder="somebody@example.com"
              type="email"
              v-model="identity.email"
            >
            </b-input>
          </b-field>
          <b-field label="web">
            <b-input placeholder="https://example.com" v-model="identity.web">
            </b-input>
          </b-field>
          <b-field label="twitter">
            <b-input placeholder="@YourTwitterName" v-model="identity.twitter">
            </b-input>
          </b-field>
          <b-field label="discord">
            <b-input
              placeholder="Discord UserName#0000"
              v-model="identity.discord"
            >
            </b-input>
          </b-field>
          <b-field label="riot">
            <b-input placeholder="@yourname:matrix.org" v-model="identity.riot">
            </b-input>
          </b-field>
          <b-field>
            <p class="subtitle is-size-6">
              {{ $t('identity.deposit') }} <Money :value="deposit" inline />
            </p>
          </b-field>

          <b-field>
            <b-button
              type="is-primary"
              icon-left="paper-plane"
              @click="shipIt"
              :disabled="disabled"
              :loading="isLoading"
              outlined
            >
              {{ $t('identity.click') }}
            </b-button>
          </b-field>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { DispatchError } from '@polkadot/types/interfaces';
import Connector from '@vue-polkadot/vue-api';
import TransactionMixin from '@/utils/mixins/txMixin';
import AuthMixin from '@/utils/mixins/authMixin';
import { update } from 'idb-keyval';
import { identityStore } from '@/utils/idbStore';

@Component({
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
    AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
    PasswordInput: () => import('@/components/shared/PasswordInput.vue'),
    Loader: () => import('@/components/shared/Loader.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
  },
})
export default class IdentityForm extends mixins(TransactionMixin, AuthMixin) {
  // @Prop() public referendumId!: any;
  private password = '';
  private identity: Record<string, string> = {
    display: '',
    email: '',
    web: '',
    twitter: '',
    discord: '',
    riot: '',
    legal: '',
  };
  private deposit = '0';

  public created(): void {
    setTimeout(() => {
      const { api } = Connector.getInstance();
      this.deposit = api.consts.identity?.basicDeposit?.toString();
    }, 3000);
  }

  public enhanceIdentityData(): Record<string, any> {
    return Object.fromEntries(
      Object.entries(this.identity).map(([key, val]: [string, string]) => {
        if (val) {
          return [key, { raw: val }];
        }
        return [key, { none: null }];
      })
    );
  }
  public async shipIt(): Promise<void> {
    const { api } = Connector.getInstance();

    try {
      const enhancedData = this.enhanceIdentityData();
      const x = {
        ...enhancedData,
      };

      this.isLoading = true;
      this.status = 'loader.sign';

      const cb = api.tx.identity.setIdentity;
      const tx = await exec(
        this.accountId,
        '',
        cb,
        [x],
        txCb(
          async (blockHash) => {
            execResultValue(tx);
            const header = await api.rpc.chain.getHeader(blockHash);
            const blockNumber = header.number.toString();

            showNotification(
              `[Identity] You are known as ${this.identity.display} since block ${blockNumber}`,
              notificationTypes.success
            );

            update(this.accountId, () => this.identity, identityStore);

            this.isLoading = false;
          },
          (dispatchError) => {
            execResultValue(tx);
            this.onTxError(dispatchError);
            this.isLoading = false;
          },
          (res) => this.resolveStatus(res.status)
        )
      );
    } catch (e) {
      if (e instanceof Error) {
        showNotification(e.toString(), notificationTypes.danger);
        this.isLoading = false;
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

  get disabled(): boolean {
    return Object.values(this.identity).filter((val) => val)?.length === 0;
  }

  protected handleIdentity(identityFields: Record<string, string>): void {
    this.identity = { ...identityFields };
  }
}
</script>
