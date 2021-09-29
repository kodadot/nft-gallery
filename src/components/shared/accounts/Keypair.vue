<template>
  <div id="Keypair" class="keypair-card__wrapper card">
      <div class="card-content">
        <div class="columns">
          <div class="column">
          <b-field grouped multiline>
            <div class="keypair-info__wrapper">
            <div v-if="!isEditingName" @click="editName()"><b>🧢{{meta.name}}</b>
            </div>
            <b-input v-if="isEditingName" v-model="newName"
              @blur="saveName()"
              @keyup.native.enter="$event.target.blur()">
            </b-input>
            <div>📇{{shortAddress(address)}}
              <b-button
              size="is-small"
              icon-left="copy"
              v-clipboard:copy="address"
              @click="toast('Address copied to clipboard')">
              </b-button>
              </div>
            <div v-if="mode === 'accounts'">🔑{{shortAddress(publicKey)}}</div>
            <div v-if="mode === 'accounts'">🆎{{type}}</div>
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
            <b-tag type="is-dark"
              v-if="meta.isTesting">testing account
            </b-tag>
            </p>
            <div>🧾 transactions <b>{{nonce}}</b></div>
            <div>🏦 available <b><Money :value="balanceAvailable" inline /></b></div>
            </div>
          </b-field>
        </div>
        <div class="column">
            <div
            v-clipboard:copy="address"
            @click="toast('Address copied to clipboard')">
            <Identicon
              :value="address"
              :theme="theme"
              :size="size"
            />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div v-if="mode === 'accounts'">
          <b-field grouped multiline>
            <b-button type="is-dark" icon-left="trash"
              @click="forgetAccount(address)" outlined>
            </b-button>
            <router-link :to="{name:'accountsBackup', params:{ address: address}}">
              <b-button type="is-dark" icon-left="cloud-download-alt" outlined></b-button>
            </router-link>
            <router-link :to="{name:'accountsChangePassword', params:{ address: address}}">
              <b-button type="is-dark" icon-left="key" outlined></b-button>
            </router-link>
            <router-link :to="{name:'transferFrom', params:{ from: address}}">
              <b-button type="is-dark" icon-left="paper-plane" outlined>Send</b-button>
            </router-link>
            <a :href="getExplorerUrl(address)" target="_blank" rel="noopener noreferrer">
              <b-button type="is-dark" icon-left="external-link-alt" outlined>View</b-button>
            </a>
          </b-field>
        </div>
        <div v-if="mode === 'addressbook'">
          <b-field grouped multiline>
            <b-button type="is-dark" icon-left="trash"
              @click="forgetAccount(address)" outlined>
            </b-button>
            <router-link :to="{name:'transferTo', params:{ to: address}}">
              <b-button type="is-dark" icon-left="paper-plane" outlined>Deposit</b-button>
            </router-link>
            <a :href="getExplorerUrl(address)" target="_blank" rel="noopener noreferrer">
              <b-button type="is-dark" icon-left="external-link-alt" outlined>View</b-button>
            </a>
          </b-field>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import Identicon from '@polkadot/vue-identicon'
import keyring from '@polkadot/ui-keyring'
import Connector from '@vue-polkadot/vue-api'
import formatBalance from '@/utils/formatBalance'
import { urlBuilderAccount } from '@/utils/explorerGuide'
import Money from '@/components/shared/format/Money.vue'

const components = { Identicon, Money }

@Component({ components })
export default class Keypair extends Vue {
  public nonce = '-';
  public balanceAvailable = '';
  public isEditingName = false;
  public isEditingTags = false;
  public newName = '';
  public newTags: any = null;
  private subs: any[] = [];
  private chainProperties: any;
  private tokenSymbol: any = Object.entries(this.$store.state.chainProperties)[2][1]
  @Prop(String) public mode!: string;
  @Prop(String) public publicKey!: string;
  @Prop(String) public type!: string;
  @Prop(String) public address!: string;
  @Prop({ default: null}) public meta!: any;
  @Prop({ default: 'polkadot'}) public theme!: string;
  @Prop({ default: 64 }) public size!: number;
  // temporary prop
  @Prop(String) public password!: string;

  getExplorerUrl(value: string) {
  	return urlBuilderAccount(value,
  		this.$store.state.explorer.chain,
  		this.$store.state.explorer.provider)
  }

  get balance() {
  	return formatBalance(this.balanceAvailable, this.tokenSymbol, false)
  }

  public editName(): void {
  	this.isEditingName = true
  	this.newName = this.meta.name
  }

  public editTags(): void {
  	this.isEditingTags = true

  	if (this.meta.tags && this.meta.tags.length === 0) {
  		this.newTags = []
  	}

  	if (this.meta.tags !== null) {
  		this.newTags = this.meta.tags.join(', ')
  	}
  }

  @Emit()
  public saveName(): void {
  	const meta = { name: this.newName, whenEdited: Date.now() }

  	const currentKeyring = keyring.getPair(this.address)
  	keyring.saveAccountMeta(currentKeyring, meta)
  	this.isEditingName = false
  }

  @Emit()
  public saveTags(): void {
  	if (this.newTags !== null) {
  		this.newTags = this.newTags.split(',')
  			.map((item: string) => item.trim())
  			.filter((item: string) => item)
  	}

  	if (this.newTags && this.newTags.length === 0) {
  		this.newTags = []
  	}

  	const meta = { tags: this.newTags,
  		whenEdited: Date.now() }

  	const currentKeyring = keyring.getPair(this.address)
  	keyring.saveAccountMeta(currentKeyring, meta)
  	this.isEditingTags = false
  }

  @Emit()
  public forgetAccount(address: string): void {
  	keyring.forgetAccount(address)
  }

  public shortAddress(address: string): string {
  	if (address) {
  		return `${address.slice(0, 6)}...${address.slice(-6)}`
  	}
  	return ''
  }

  public toast(message: string): void {
  	this.$buefy.toast.open(message)
  }

  public async loadExternalInfo() {
  	const { api } = Connector.getInstance()
  	const { nonce, data: balance } = await api.query.system.account(this.address)
  	this.balanceAvailable = balance.free.toString()
  	this.nonce = nonce.toString()
  	console.log(this.balanceAvailable)
  }

  public mounted(): void {
  	this.loadExternalInfo()
  }

  public beforeDestroy() {
  	this.subs.forEach((sub) => sub())
  }
}
</script>

<style scoped>
  .keypair-card__wrapper {
    margin-bottom: 1em;
  }
</style>
