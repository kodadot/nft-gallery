<template>
  <div id="Keypair" class="keypair-card__wrapper card">
      <div class="card-content">
        <b-field grouped multiline>
          <div v-clipboard:copy="address"
            @click="toast('Address copied to clipboard')">
            <Identicon
              :value="address"
              :theme="theme"
              :size="size"
            />
          </div>
          <div class="keypair-info__wrapper">
          <div v-if="!isEditingName" @click="editName()"><b>🧢{{meta.name}}</b>
          </div>
          <b-input v-if="isEditingName" v-model="newName" @blur="saveName()">
          </b-input> 
          <div>📇{{shortAddress(address)}}
            <b-button
            size="is-small" 
            icon-left="copy" 
            v-clipboard:copy="address"
            @click="toast('Address copied to clipboard')">
            </b-button>
            </div>
          <div>🔑{{shortAddress(publicKey)}}</div>
          <div v-if="mode === 'accounts'">🆎type {{type}}</div>
          <p v-if="!meta.tags && !isEditingTags 
            || meta.tags === null && !isEditingTags
            || meta.tags !== null && meta.tags.length === 0 && !isEditingTags" 
            @click="editTags()">🏷 add tags</p>
          <b-input v-if="isEditingTags" 
            v-model="newTags" 
            @blur="saveTags()" 
            @keyup.native.enter="$event.target.blur()">
          </b-input>
          <p @click="editTags()" v-if="!isEditingTags && meta.tags">
          🏷<b-tag
            v-for="t in meta.tags"
            v-bind:key="t">
            {{t}}
          </b-tag>
          <b-tag type="is-light" 
            v-if="meta.isTesting">testing account
          </b-tag>
          </p>
          <div>🧾 transactions {{nonce}}</div>
          <div>🏦 available {{balanceAvailable}}</div>
          </div>
        </b-field>
      </div>
      <div>
        <div v-if="mode === 'accounts'">
          <b-field grouped multiline>
            <b-button type="is-dark" icon-left="trash" 
              @click="forgetAccount(address)" outlined>
            </b-button>
            <router-link :to="'/accounts/backup/'+address">
              <b-button type="is-dark" icon-left="cloud-download-alt" outlined></b-button>
            </router-link>
            <router-link :to="'/accounts/changepassword/'+address">
              <b-button type="is-dark" icon-left="key" outlined></b-button>
            </router-link>
            <router-link :to="'/transfer/from/'+address">
              <b-button type="is-dark" icon-left="paper-plane" outlined>Send</b-button>
            </router-link>
            <a :href="explorerAccount+address">
              <b-button type="is-dark" icon-left="external-link-alt" outlined>View</b-button>
            </a>
          </b-field>
        </div>
        <div v-if="mode === 'addressbook'">
          <b-field grouped multiline>
            <b-button type="is-dark" icon-left="trash" 
              @click="forgetAccount(address)" outlined>
            </b-button>
            <router-link :to="'/transfer/to/'+address">
              <b-button type="is-dark" icon-left="paper-plane" outlined>Deposit</b-button>
            </router-link>
            <a :href="explorerAccount+address">
              <b-button type="is-dark" icon-left="external-link-alt" outlined>View</b-button>
            </a>
          </b-field>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import Identicon from '@polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';

@Component({
  components: {
    Identicon,
  },
})
export default class Keypair extends Vue {
  public nonce: number = 0;
  public balanceAvailable: number = 0;
  public explorerAccount: string = 'https://polkascan.io/pre/kusama/account/';
  public isEditingName: boolean = false;
  public isEditingTags: boolean = false;
  public newName: string = '';
  public newTags: any = null;
  @Prop(String) public mode!: string;
  @Prop(String) public publicKey!: string;
  @Prop(String) public type!: string;
  @Prop(String) public address!: string;
  @Prop({ default: null}) public meta!: any;
  @Prop({ default: 'polkadot'}) public theme!: string;
  @Prop({ default: 64 }) public size!: number;
  // temporary prop
  @Prop(String) public password!: string;

  public editName(): void {
    this.isEditingName = true;
    this.newName = this.meta.name;
  }

  public editTags(): void {
    this.isEditingTags = true;

    if (this.meta.tags && this.meta.tags.length === 0) {
      this.newTags = [];
    }

    if (this.meta.tags !== null) {
      this.newTags = this.meta.tags.join(', ');
    }
  }

  @Emit()
  public saveName(): void {
    const meta = { name: this.newName, whenEdited: Date.now() };

    const currentKeyring = keyring.getPair(this.address);
    keyring.saveAccountMeta(currentKeyring, meta);
    this.isEditingName = false;
  }

  @Emit()
  public saveTags(): void {
    if (this.newTags !== null) {
      this.newTags = this.newTags.split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    }

    if (this.newTags && this.newTags.length === 0) {
      this.newTags = [];
    }

    const meta = { tags: this.newTags,
      whenEdited: Date.now() };

    const currentKeyring = keyring.getPair(this.address);
    keyring.saveAccountMeta(currentKeyring, meta);
    this.isEditingTags = false;
  }

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
    // FIX ME, KUSAMA INTRODUCED NEW TYPES
    // this.loadExternalInfo();
  }
}
</script>

<style scoped>
  .keypair-card__wrapper {
    margin-bottom: 1em;
  }

  .keypair-info__wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
