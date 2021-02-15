<template>
  <div class="container is-max-desktop">
    <Navbar/>
    <router-view id="routerview" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import Navbar from './components/Navbar.vue';
import Connector from '@vue-polkadot/vue-api';

@Component<Dashboard>({
  metaInfo() {
    return {
      title: 'KodaDot 🖼👀 First Polkadot/Kusama NFT Market Explorer',
      titleTemplate: '%s | KodaDot',
      meta: [{ 
        vmid: 'description',
        name: 'description',
        content: 'KodaDot 🖼👀 First Polkadot/Kusama NFT Market Explorer'
      },
      { property: 'og:title', content: 'KodaDot 🖼👀 First Polkadot/Kusama NFT Market Explorer' },
      { property: 'og:type', content: 'website'},
      { property: 'og:url', content: 'https://kodadot.xyz'},
      { property: 'og:description', content: 'KodaDot 🖼👀 First Polkadot/Kusama NFT Market Explorer' },
      { property: 'og:site_name', content: 'KodaDot 🖼👀 First Polkadot/Kusama NFT Market Explorer'},
      { property: 'og:locale', content: 'en_US'},
      // { property: 'og:image', content: '/img/icons/android-chrome-256x256.png'}
      ]
    }
  },
  components: {
    Navbar,
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
    keyring.loadAll({
      ss58Format: this.ss58Format || 42,
      type: 'sr25519',
      isDevelopment: process.env.VUE_APP_KEYRING === 'true' || false,
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

  public mounted(): void {
    this.mountWasmCrypto();
  }
}
</script>

<style lang="scss">

// Import Bulma's core
@import "~bulma/sass/utilities/_all";
@import "./colors";
@import "./layout";

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
);

$layout: (
    "container-offset": ($container-offset),
    "container-max-width": ($container-max-width),
    "tablet": ($tablet),
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
