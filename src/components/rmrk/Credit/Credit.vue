<template>
  <div class="container">
    <div class="box">
      <b-message title="Top-up your Kusama address (experimental integration)" type="is-info" has-icon>
        Select your account and click on buy. <br>
        You will be redirected to hosted mode of Ramp.network to top-up your address. <br>
        KYC might requried, but you can verify with your Revolut card.
      </b-message>
      <p>

      </p>
      <AccountSelect label="Account" v-model="accountId" />
      <b-button type="is-primary"
        tag="a"
        :href="`https://ramp.network/buy/?swapAsset=KSM`
        + `&userAddress=${accountId}`
        + `&hostAppName=KodaDot`
        + `&hostLogoUrl=https://nft.kodadot.xyz/kodadot_logo_v1_transparent_400px.png`
        + `&finalUrl=https://nft.kodadot.xyz`
        + `hostApiKey=a99bfvomhhbvzy6thaycxbawz7d3pssuz2a8hsrc`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Buy Kusama
      </b-button><br>
    </div>
    <!-- Manual query parameters for Ramp
    https://docs.ramp.network/configuration/ -->

  </div>
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator'
import AccountSelect from '@/components/shared/AccountSelect.vue'

const components = {
  AccountSelect
}

@Component({ components })
export default class Credit extends Vue {
  private accountId = '';
}
</script>
