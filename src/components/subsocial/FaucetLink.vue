<template>
  <a v-if="!email" href="https://app.subsocial.network/faucet" target="_blank">{{ $t('subsocial.faucet') }}</a>
  <a v-else @click="askFaucet" type="is-ghost">{{ $t('subsocial.autoFaucet') }}</a>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';
import AuthMixin from '@/utils/mixins/authMixin';
import shouldUpdate from '@/utils/shouldUpdate';
import Connector from '@vue-polkadot/vue-api';
import { requestFaucet } from '@/proxy';
import { showNotification, notificationTypes } from '@/utils/notification';

@Component({})
export default class FaucetLink extends Mixins(AuthMixin) {
  protected email: string = 'vikiival@kodadot.xyz';

  protected async askFaucet() {
    try {
      const faucet = await requestFaucet(this.accountId, this.email)
      if (!faucet) {
        showNotification('[Faucet] At least you tried :/\nClick again to visit official faucet', notificationTypes.warn)
      } else {
        showNotification(`[Faucet] Check your mail\n${this.email}`, notificationTypes.info)
      }
    } catch (e) {
        showNotification('[Faucet] At least you tried :/\nClick again to visit official faucet', notificationTypes.warn)
    } finally {
      this.email = '';
    }
  }

  private async fetchIdentityEmail(address: string) {
    const { api } = Connector.getInstance()
    const identity = await api?.query.identity.identityOf(address)
    if (identity?.isSome) {
      const registration = identity.unwrap()
      console.log(registration.info.email.asRaw.toHuman())
    }

  }

  @Watch('accountId', { immediate: true })
  watchAddress(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchIdentityEmail(val)
    }
  }
}
</script>
