<template>
  <div id="dashboard" class="columns">
    <SidebarMenu />
    <div class="column router-view">
      <router-view id="routerview" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import keyring from '@vue-polkadot/vue-keyring';
import SidebarMenu from './components/SidebarMenu.vue';
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    SidebarMenu,
  },
})
export default class Dashboard extends Vue {
  private chainProperties: any;
  private ss58Format: any = 42;

  public async getChainProperties(): Promise<void> {
    this.ss58Format = Object.entries(this.$store.state.chainProperties)[0][1];
    console.log('ss58format - settings', this.ss58Format);
  }

  public async loadKeyring(): Promise<void> {
    this.getChainProperties();
    keyring.loadAll({
      ss58Format: this.ss58Format,
      type: 'sr25519',
      isDevelopment: false,
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

<style>
#routerview {
  padding: 1em;
  min-height: inherit;
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
  min-height: 100vh;
}

.column.router-view {
  background-color: rgb(252, 252, 252);
  overflow-y: scroll;
  padding: 0; 
}

@media screen and (max-width: 992px) {
  .columns {
    display: flex;
  }
}

</style>
