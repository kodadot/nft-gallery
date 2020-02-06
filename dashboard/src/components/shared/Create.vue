<template>
  <div id="createAccount">
    <section>
      <div>
        <b-field grouped>
          <b-field>
            <Identicon 
              :value="newAccount.address"
              :theme="theme"
              size="64" />
          </b-field>
          <b-field>
            {{newAccount.name.toUpperCase()}}<br>
            {{shortAddress(newAccount.address)}}
          </b-field>
        </b-field>
      </div>
      <b-field label="name" 
        v-bind:type="{ 'is-danger': !isNameValid }" >
        <b-input v-model="newAccount.name"
          @input="checkAccountName()"
          placeholder="new account">
        </b-input>
      </b-field>
      <div v-if="mode === 'addressbook'">
        <b-field label="address">
          <b-input v-model="newAccount.address"
            @input="checkAlreadyPresentAddress(newAccount.address)">
          </b-input>
        </b-field>
      </div>
      <div v-if="mode === 'accounts'">
      <b-field label="mnemonic seed" 
        v-bind:type="{ 'is-danger': !isValidMnemonic }">
        <b-input v-model="newAccount.mnemonicSeed"
          @input="validateMnemonic()"
          :expanded='true'>
        </b-input>
        <p class="control">
          <b-button class="button is-dark" icon-left="sync"
            @click="generateSeed(); addressFromSeed(); validateMnemonic()"
            outlined>
              Mnemonic
          </b-button>
        </p>
      </b-field>
      <b-field label="password" 
        v-bind:type="{ 'is-danger': !validatePassword(newAccount.password) }">
        <b-input v-model="newAccount.password" type="password"
         @input="validatePassword(newAccount.password)"
         password-reveal></b-input>
      </b-field>
      <b-field label="tags">
          <b-input v-model="newAccount.tags"></b-input>
        </b-field>
      <b-field grouped>
        <b-field label="keypair crypto type">
          <b-select v-model="keypairType.selected">
            <option v-for="opt in keypairType.options"
              v-bind:key="opt.value"
              v-bind:value="opt.value">
              {{ opt.text }}
            </option>
          </b-select>
        </b-field>
      </b-field>
      <b-field label="secret derivation path">
        <b-input v-model="newAccount.derivationPath"
          placeholder="//hard/soft///password">
        </b-input>
      </b-field>
      </div>
    </section>
    <div>
      <router-link :to="'/'+mode">
        <b-button 
          type="is-dark"
          icon-left="plus"
          @click="onCreate" 
          outlined
          :disabled="duplicateAddress
            || !(newAccount.address.length > 0) 
            || validatePassword(newAccount.password) 
            || !checkAccountName()">
          Create
        </b-button>
      </router-link>
      <router-link :to="'/'+mode">
        <b-button 
          type="is-warning"
          icon-left="times"
          outlined>
          Cancel
        </b-button>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import keyring from '@vue-polkadot/vue-keyring';
import Identicon from '@vue-polkadot/vue-identicon';
import { keyExtractSuri, mnemonicGenerate,
  mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';

@Component({
  components: {
    Identicon,
  },
})
export default class Create extends Vue {
  @Prop(String) public theme!: string;
  @Prop(String) public mode!: string;
  // will be replaced by uiSettings
  public keypairType: any = {
    selected: 'sr25519',
    options: [
      { text: 'Schnorrkel (sr25519)', value: 'sr25519' },
      { text: 'Edwards (ed25519)', value: 'ed25519' },
    ],
  };

  public duplicateAddress: boolean = false;
  public isNameValid: boolean = false;
  public keyringAccounts: any = [
    { address: '', meta: { name: ''}, publicKey: '', type: '' },
  ];
  public isValidMnemonic: boolean = false;
  public isPassValid: boolean = false;
  public newAccount: any = {
    password: '',
    name: '',
    tags: '',
    mnemonicSeed: '',
    keypairType: this.keypairType,
    derivationPath: '',
    address: '',
  };

  public shortAddress(address: string): string {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return '';
  }

  public validateMnemonic(): boolean {
    return this.isValidMnemonic = mnemonicValidate(this.newAccount.mnemonicSeed);
  }

  public validatePassword(password: string): boolean {
    return this.newAccount.password.length > 0 && keyring.isPassValid(password);
  }

  public generateSeed(): string {
    if (this.mode === 'accounts') {
      return this.newAccount.mnemonicSeed = mnemonicGenerate();
    }
    return '';
  }

  public checkAccountName(): boolean {
    return this.isNameValid = this.newAccount.name.length > 0;
  }

  public checkAlreadyPresentAddress(address: string): void {
    if (this.mode === 'addressbook') {
      const keyringAddrs = Object.values(keyring.getAccounts());
      const alreadyExists = keyringAddrs.find((acc) => acc.address === address);
      if (alreadyExists) {
        this.toast('Already have same address in Keyring');
        this.duplicateAddress = true;
      }
      if (!alreadyExists) {
        this.duplicateAddress = false;
      }
    }
  }

  public toast(message: string): void {
    this.$buefy.toast.open({
      message,
      type: 'is-warning'});
  }

  @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    if (this.isKeyringLoaded()) {
      this.keyringAccounts = keyring.getPairs();
    }
  }

  @Emit()
  public onCreate(): void {
    try {
      const meta = {
        name: this.newAccount.name,
        tags: this.newAccount.tags.split(','),
        whenCreated: Date.now() };
      if (this.mode === 'accounts') {
        const { json, pair } = keyring.addUri(`${this.newAccount.mnemonicSeed}${this.newAccount.derivationPath}`,
          this.newAccount.password, meta, this.keypairType.selected);
      }
      if (this.mode === 'addressbook') {
        const { json, pair } = keyring.addExternal(this.newAccount.address, meta);
      }
    } catch (error) {
      console.error(error);
    }
  }

  @Watch('$store.state.keyringLoaded')
  public addressFromSeed(): string {
    if (this.mode === 'accounts') {
      return this.newAccount.address = keyring.createFromUri(`${this.newAccount.mnemonicSeed.trim()}${this.newAccount.derivationPath}`,
        {}, this.keypairType.selected).address;
    }
    return '';
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public coldStart(): void {
    this.generateSeed();
    this.validateMnemonic();
    if (this.isKeyringLoaded()) {
      this.addressFromSeed();
    }
  }
  public mounted(): void {
    this.coldStart();
    this.mapAccounts();
  }
}
</script>