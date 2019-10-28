<template>
  <div id="Keypair">
      <div>
        <b-field grouped multiline>
          <Identicon
            :value="address"
            :theme="theme"
            :size="size" />
          {{meta.name}}
            {{shortAddress(address)}}
              <b-button
              size="is-small" 
              icon-left="copy" 
              v-clipboard:copy="address"
              @click="toast('Address copied to clipboard')">
              </b-button>
            {{shortAddress(publicKey)}}  
            type {{type}}
            <p v-if="meta.tags">
            <b-tag 
              v-for="t in meta.tags"
              v-bind:key="t"
              >{{t}}
            </b-tag>
            <b-tag type="is-light" 
              v-if="meta.isTesting">testing account
            </b-tag>
            </p>
            transactions {{nonce}}
            available {{balanceAvailable}}
        </b-field>
      </div>
      <div>
        <b-field grouped multiline>
          <b-button type="is-dark" icon-left="trash" 
            @click="forgetAccount(address)" outlined>
          </b-button>
          <b-button type="is-dark" icon-left="cloud-download-alt" outlined></b-button>
          <b-button type="is-dark" icon-left="key" outlined></b-button>
          <b-button type="is-dark" icon-left="paper-plane" outlined>Send</b-button>
          <a :href="explorer+address">
            <b-button type="is-dark" icon-left="binoculars" outlined>View</b-button>
          </a>
        </b-field>
        <!-- will go to the modals -->
        <!-- <Backup v-if="!meta.isTesting"
          :address="address"
          :password="password" />
        <ChangePass v-if="address && !meta.isTesting"
          :address="address" /> -->
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import Backup from './Backup.vue';
import ChangePass from './ChangePasss.vue';
import keyring from '@vue-polkadot/vue-keyring';

@Component({
  components: {
    Backup,
    ChangePass,
    Identicon,
  },
})
export default class Keypair extends Vue {
  public nonce: number = 0;
  public balanceAvailable: number = 0;
  public explorer: string = 'https://polkascan.io/pre/alexander/account/';

  @Prop(String) public publicKey!: string;
  @Prop(String) public type!: string;
  @Prop(String) public address!: string;
  @Prop({ default: 'no-meta'}) public meta!: string;
  @Prop({ default: 'polkadot'}) public theme!: string;
  @Prop({ default: 64 }) public size!: number;
  // temporary prop
  @Prop(String) public password!: string;

  @Emit()
  public forgetAccount(address: string): void {
    keyring.forgetAccount(address);
  }

  public shortAddress(address: string): string {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return '';
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message);
  }

  public async loadExternalInfo() {
    if ((this as any).$http.api && this.address) {
      const fromBalance = await (this as any).$http.api.query.balances.freeBalance(this.address);
      this.balanceAvailable = await fromBalance.toString();
      const nonce = await (this as any).$http.api.query.system.accountNonce(this.address);
      this.nonce = await nonce;
    }
  }

  public mounted(): void {
    this.loadExternalInfo();
  }
}
</script>
