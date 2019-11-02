<template>
  <div id="dashboard" class="columns">
    <SidebarMenu />
    <div class="column router-view">
      <router-view id="routerview" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { waitReady } from '@polkadot/wasm-crypto';
import keyring from '@vue-polkadot/vue-keyring';
import SidebarMenu from './components/SidebarMenu.vue';

@Component({
  components: {
    SidebarMenu,
  },
})
export default class Dashboard extends Vue {
  public loadKeyring(): void {
    keyring.loadAll({
      ss58Format: 42,
      type: 'sr25519',
      isDevelopment: false,
    });
  }

  public async mountWasmCrypto(): Promise<void> {
    await waitReady();
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

<style>
#routerview {
  padding: 1em;
}

.friendly-view {
  display: flex;
  flex-direction: row;
}

.friendly-view > .happy-menu {
  flex: 2;
}

.friendly-view #routerview {
  flex: 10;
}

.friendly-view {
  height: 100vh;
}

.column.router-view {
  padding: 0;
}

@media screen and (max-width: 992px) {
  .columns {
    display: flex;
  }
}

</style>
