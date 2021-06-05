<template>
  <div
    class="
      is-flex
      is-flex-direction-column
      min-h-full
    "
  >
    <Navbar v-if="isNavbarVisible"/>
    <main class="is-flex-grow-1 mt-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import isShareMode from '@/utils/isShareMode'
import coingecko from '@/coingecko'

@Component<Dashboard>({
  metaInfo() {
    return {
      title: 'KodaDot - Kusama NFT Market Explorer',
      titleTemplate: '%s | Low Carbon NFTs',
      meta: [
      { property: 'og:type', content: 'website'},
      // { property: 'og:url', content: 'https://nft.kodadot.xyz'},
      { property: 'og:locale', content: 'en_US'},
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:site', content: '@KodaDot' },
      ]
    }
  },
  components: {
    Navbar,
    Footer
  }
})
export default class Dashboard extends Vue {
  get chainProperties() {
    return this.$store.getters.getChainProperties;
  }

  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }

  public async loadKeyring(): Promise<void> {
    const isDevelopment = process.env.VUE_APP_KEYRING === 'true'
    keyring.loadAll({
      ss58Format: isDevelopment ? 0 : this.ss58Format || 42,
      type: 'sr25519',
      isDevelopment,
    });
  }

  public async mountWasmCrypto(): Promise<void> {
    await cryptoWaitReady();
    console.log('wasmCrypto loaded');
    this.loadKeyring();
    console.log('keyring init');
    this.$store.commit('keyringLoaded');
    console.log('keyring loaded');
  }

  public async getKsmPrice(): Promise<void> {
    try {
      const { data } = await coingecko.get(`/simple/price`, {
        params: {
          ids: 'kusama',
          vs_currencies: 'usd'
        }
      })

      this.$store.dispatch('setFiatPrice', data);
    } catch (error) {
      console.log(error)
    }
  }

  public mounted(): void {
    this.mountWasmCrypto();
    this.getKsmPrice();
  }

  get isNavbarVisible() {
    return !isShareMode
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
