<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <div class="box">
      <p class="title is-size-3">
        {{ $t('identity.set') }}
        <b-tooltip
          label="0.0333 KSM will be reserved. These funds are returned when the identity is cleared."
          position="is-bottom">
          <b-icon icon="info-circle" />
        </b-tooltip>
      </p>

      <p class="subtitle is-size-6" v-if="accountId">
        <Auth />
        <span>{{ $t('general.balance') }}: </span>
        <Money :value="balance" inline />
      </p>

      <b-field label="Handle">
        <b-input
          placeholder="My On-Chain Name"
          v-model="identity.display"
          required
          :validation-message="$t('identity.handleRequired')">
        </b-input>
      </b-field>

      <BasicInput
        v-model="identity.legal"
        label="Name"
        placeholder="Full Legal Name"
        expanded />

      <BasicInput
        type="email"
        v-model="identity.email"
        label="Email"
        placeholder="somebody@example.com"
        expanded />

      <BasicInput
        v-model="identity.web"
        label="Web"
        placeholder="https://example.com"
        expanded />

      <BasicInput
        v-model="identity.twitter"
        label="Twitter"
        placeholder="@YourTwitterName"
        expanded />

      <BasicInput
        v-model="identity.discord"
        label="Discord"
        placeholder="Discord UserName#0000"
        expanded />

      <BasicInput
        v-model="identity.riot"
        label="Riot"
        placeholder="@yourname:matrix.org"
        expanded />

      <p class="subtitle is-size-6">
        {{ $t('identity.deposit') }} <Money :value="deposit" inline />
      </p>

      <SubmitButton
        :label="$t('identity.click')"
        :disabled="disabled"
        :loading="isLoading"
        @click="submit" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { notificationTypes, showNotification } from '@/utils/notification'
import Connector from '@kodadot1/sub-api'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import AuthMixin from '@/utils/mixins/authMixin'
import { update } from 'idb-keyval'
import { identityStore } from '@/utils/idbStore'

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
    Loader: () => import('@/components/shared/Loader.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    SubmitButton: () => import('@/components/base/SubmitButton.vue'),
  },
})
export default class IdentityForm extends mixins(
  MetaTransactionMixin,
  AuthMixin
) {
  private identity: Record<string, string> = {
    display: '',
    email: '',
    web: '',
    twitter: '',
    discord: '',
    riot: '',
    legal: '',
  }
  private deposit = '0'

  public created(): void {
    setTimeout(() => {
      const { api } = Connector.getInstance()
      this.deposit = api.consts.identity?.basicDeposit?.toString()
    }, 3000)
  }

  public enhanceIdentityData(): Record<string, any> {
    return Object.fromEntries(
      Object.entries(this.identity).map(([key, val]: [string, string]) => {
        if (val) {
          return [key, { raw: val }]
        }
        return [key, { none: null }]
      })
    )
  }

  protected async submit(): Promise<void> {
    const { api } = Connector.getInstance()
    this.initTransactionLoader()
    const cb = api.tx.identity.setIdentity
    const args = [this.enhanceIdentityData()]
    this.howAboutToExecute(this.accountId, cb, args, this.onSuccess)
  }

  protected onSuccess(block: string) {
    showNotification(
      `[Identity] You are known as ${this.identity.display} since block ${block}`,
      notificationTypes.success
    )

    update(this.accountId, () => this.identity, identityStore)
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }

  get disabled(): boolean {
    return Object.values(this.identity).filter((val) => val)?.length === 0
  }
}
</script>
