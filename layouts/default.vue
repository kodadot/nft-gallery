<template>
  <div
    class="
      is-flex
      is-flex-direction-column
      min-h-full
    "
  >
    <Navbar v-if="isNavbarVisible" />
    <main class="is-flex-grow-1 mt-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import keyring from '@polkadot/ui-keyring'
import isShareMode from '@/utils/isShareMode'
import correctFormat from '@/utils/ss58Format'

@Component<Dashboard>({
  metaInfo() {
    return {
      title: 'KodaDot - Kusama NFT Market Explorer',
      titleTemplate: '%s | Low Carbon NFTs',
      meta: [
        { property: 'og:type', content: 'website' },
        // { property: 'og:url', content: 'https://nft.kodadot.xyz'},
        { property: 'og:locale', content: 'en_US' },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:site', content: '@KodaDot' }
      ]
    }
  },
})
export default class Dashboard extends Vue {
  get chainProperties() {
    return this.$store.getters['chain/getChainProperties']
  }

  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }

  public async loadKeyring(): Promise<void> {
    const isDevelopment = process.env.VUE_APP_KEYRING === 'true'
    keyring.loadAll({
      ss58Format: correctFormat(this.ss58Format),
      type: 'sr25519',
      isDevelopment
    })
  }

  public async mountWasmCrypto(): Promise<void> {
    await cryptoWaitReady()
    console.log('wasmCrypto loaded')
    this.loadKeyring()
    this.$store.commit('keyringLoaded') // TODO: refact to dispatch and move outside
  }

  public mounted(): void {
    this.mountWasmCrypto()
  }

  get isNavbarVisible() {
    return !isShareMode
  }
}
</script>
