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
import { Component, Vue, Watch } from 'vue-property-decorator'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import keyring from '@polkadot/ui-keyring'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import isShareMode from '@/utils/isShareMode'
import coingecko from '@/coingecko'
import correctFormat from '@/utils/ss58Format'
import checkIndexer from '@/queries/checkIndexer.graphql'
import { showNotification } from './utils/notification'

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
  components: {
    Navbar,
    Footer
  }
})
export default class Dashboard extends Vue {
  get chainProperties() {
    return this.$store.getters.getChainProperties
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
    this.$store.commit('keyringLoaded')
  }

  public async getKsmPrice(): Promise<void> {
    try {
      const { data } = await coingecko.get('/simple/price', {
        params: {
          ids: 'kusama',
          vs_currencies: 'usd'
        }
      })

      this.$store.dispatch('setFiatPrice', data)
    } catch (error) {
      console.log(error)
    }
  }

  public mounted(): void {
    this.mountWasmCrypto()
    this.fetchIndexer()
    this.getKsmPrice()
  }

  private async fetchIndexer() {
    try {
      const indexer = this.$apollo.query({
        query: checkIndexer
      })

      const {
        data: { _meta: data }
      } = await indexer

      console.log(
        `
    %cIndexer:
    Health: ${data?.indexerHealthy ? '❤️' : '💀'}
    Last: ${new Date(Number(data?.lastProcessedTimestamp))}
    `,
        'background: #222; color: #bada55; padding: 0.3em'
      )
      this.$store.dispatch('upateIndexerStatus', data)
    } catch (error) {
      const type = {
        indefinite: true,
        position: 'is-top-right',
        message: `
        <p class="title is-3">Indexer Error</p>
    <p class="subtitle">Indexer is not working properly
    <a target="_blank" rel="noopener noreferrer"  href="https://explorer.subquery.network/subquery/vikiival/magick">and you can check the status here</a></p>
    <p class="subtitle">If you think this should't happen, report us by
      <a target="_blank" rel="noopener noreferrer"  href="https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=bug&template=bug_report.md&title=">creating bug issue with steps to reproduce and screenshot.</a></p>
        `,
        type: 'is-danger',
        hasIcon: true
      }
      this.$buefy.snackbar.open(type as any)
      // this.$router.push({ name: 'error' });
      console.warn('Do something', error)
    }
  }

  get isNavbarVisible() {
    return !isShareMode
  }
}
</script>

<style lang="scss">
@import "./styles";
</style>
