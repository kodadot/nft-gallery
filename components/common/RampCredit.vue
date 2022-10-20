<template>
  <section>
    <div class="box">
      <b-message
        title="Top-up your Kusama address (experimental integration)"
        type="is-info"
        has-icon>
        {{ $t('ramp.selectAccount') }} <br />
        {{ $t('ramp.redirect') }} <br />
        {{ $t('ramp.kyc') }}
      </b-message>
      <AccountSelect v-model="accountId" label="Account" />
      <b-button
        type="is-primary"
        tag="a"
        :href="getLink(accountId)"
        target="_blank"
        rel="noopener noreferrer">
        {{ $t('ramp.buyKsm') }}
      </b-button>
    </div>
    <!-- Manual query parameters for Ramp
    https://docs.ramp.network/configuration/ -->
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import AccountSelect from '@/components/shared/AccountSelect.vue'
import AuthMixin from '@/utils/mixins/authMixin'
import { URLS } from '~/utils/constants'

const components = {
  AccountSelect,
}

@Component({ components })
export default class RampCredit extends mixins(AuthMixin) {
  layout() {
    return 'centered-half-layout'
  }

  protected getLink(accountId: string) {
    return `${URLS.providers.ramp}?defaultAsset=KSM&userAddress=${accountId}&hostAppName=KodaDot&hostLogoUrl=https://kodadot.xyz/apple-touch-icon.png&finalUrl=https://kodadot.xyz&hostApiKey=a99bfvomhhbvzy6thaycxbawz7d3pssuz2a8hsrc`
  }
}
</script>
