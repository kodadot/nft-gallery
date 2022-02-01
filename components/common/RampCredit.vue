<template>
  <section>
    <div class="box">
      <b-message
        title="Top-up your Kusama address (experimental integration)"
        type="is-info"
        has-icon>
        Select your account and click on buy. <br />
        You will be redirected to hosted mode of Ramp.network to top-up your
        address. <br />
        KYC might requried, but you can verify with your Revolut card.
      </b-message>
      <p />
      <AccountSelect v-model="accountId" label="Account" />
      <b-button
        type="is-primary"
        tag="a"
        :href="
          `https://ramp.network/buy/?swapAsset=KSM` +
          `&userAddress=${accountId}` +
          `&hostAppName=KodaDot` +
          `&hostLogoUrl=https://nft.kodadot.xyz/kodadot_logo_v1_transparent_400px.png` +
          `&finalUrl=https://nft.kodadot.xyz` +
          `hostApiKey=a99bfvomhhbvzy6thaycxbawz7d3pssuz2a8hsrc`
        "
        target="_blank"
        rel="noopener noreferrer">
        Buy Kusama
      </b-button>
    </div>
    <!-- Manual query parameters for Ramp
    https://docs.ramp.network/configuration/ -->
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import AccountSelect from '@/components/shared/AccountSelect.vue'

const components = {
  AccountSelect,
}

@Component({ components })
export default class RampCredit extends Vue {
  private accountId = ''
}
</script>
