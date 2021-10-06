<template>
  <div id="createAccount">
    <section>
      <div>
        <b-field grouped>
          <b-field>
            <Identicon
              :value="newAccount.address.toString()"
              :size="size"
             />
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
          @input="checkAccountName(); validateSave()"
          placeholder="new account">
        </b-input>
      </b-field>
      <div v-if="mode === 'addressbook'">
        <b-field label="address"
          v-bind:type="{ 'is-danger': !newAccount.address.length
          || !isAddressValid || !uniqueAddress }">
          <b-input v-model="newAccount.address"
            @input="validateAddress(newAccount.address);
              checkAlreadyPresentAddress(newAccount.address);
              validateSave()">
          </b-input>
        </b-field>
      </div>
      <div v-if="mode === 'accounts'">
      <b-field label="mnemonic seed"
        v-bind:type="{ 'is-danger': !isSeedValid }">
        <b-input v-if="seedType === 'mnemonic'" v-model="newAccount.mnemonicSeed"
          @input="validateMnemonic(); addressFromSeed('mnemonic'); validateSeed()"
          :expanded='true'>
        </b-input>
        <b-input v-if="seedType === 'raw'" v-model="newAccount.rawSeed"
          @input="validateRawSeed(); addressFromSeed('raw'); validateSeed()"
          :expanded='true'>
        </b-input>
        <p class="control">
          <b-dropdown v-model="seedType" position="is-bottom-left" aria-role="list">
            <button class="button is-dark" type="button" slot="trigger">
              <template v-if="seedType === 'mnemonic'">
                <span>Mnemonic</span>
              </template>
              <template v-if="seedType === 'raw'">
                <span>Raw Seed</span>
              </template>
              <b-icon icon="caret-down"></b-icon>
            </button>
            <b-dropdown-item value="mnemonic"
              @click="dropdownClick('mnemonic')">
              Mnemonic
            </b-dropdown-item>
            <b-dropdown-item value="raw"
              @click="dropdownClick('raw')">
              Raw Seed
            </b-dropdown-item>
          </b-dropdown>
        </p>
      </b-field>
      <b-field label="password"
        v-bind:type="{ 'is-danger': !isPassValid }">
        <b-input v-model="newAccount.password" type="password"
         @input="validatePassword(newAccount.password); validateSave()"
         password-reveal></b-input>
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
      <b-field></b-field>
      <b-field label="tags">
        <b-input v-model="newAccount.tags" placeholder="comma separated values"></b-input>
      </b-field>
      <b-field></b-field>
    </section>
    <div>
      <router-link :to="{ name: mode }">
        <b-button
          type="is-dark"
          icon-left="plus"
          @click="onCreate"
          outlined
          :disabled="!canSave">
          Save
        </b-button>
      </router-link>
      <router-link :to="{ name: mode }">
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
import keyring from '@polkadot/ui-keyring';
import Identicon from '@polkadot/vue-identicon';
import { keyExtractSuri, mnemonicGenerate,
  mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';
import { isHex, u8aToHex } from '@polkadot/util';

@Component({
  components: {
    Identicon,
  },
})
export default class Create extends Vue {
  @Prop(String) public theme!: string;
  @Prop(String) public mode!: string;
  @Prop({ default: 64 }) public size!: number;

  // will be replaced by uiSettings
  public keypairType: any = {
    selected: 'sr25519',
    options: [
      { text: 'Schnorrkel (sr25519)', value: 'sr25519' },
      { text: 'Edwards (ed25519)', value: 'ed25519' },
    ],
  };

  public canSave: boolean = false;
  public uniqueAddress: boolean = true;
  public isAddressValid: boolean = false;
  public isNameValid: boolean = false;
  public isValidMnemonic: boolean = false;
  public isValidRawSeed: boolean = false;
  public isSeedValid: boolean = false;
  public isPassValid: boolean = false;
  public seedType: string = 'mnemonic';
  public keyringAccounts: any = [{
    address: '',
    meta: { name: ''},
    publicKey: '',
    type: '',
  }];
  public newAccount: any = {
    password: '',
    name: '',
    tags: null,
    mnemonicSeed: '',
    rawSeed: '',
    keypairType: this.keypairType,
    derivationPath: '',
    address: '',
  };

  public checkAccountName(): boolean {
    return this.isNameValid = this.newAccount.name.length > 0;
  }

  public shortAddress(address: string): string {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return '';
  }

  public validateSeed(): boolean {
    return this.isSeedValid = this.validateMnemonic() && this.validateRawSeed();
  }

  public validateMnemonic(): boolean {
    return this.isValidMnemonic = mnemonicValidate(this.newAccount.mnemonicSeed);
  }

  public validatePassword(password: string): boolean {
    return this.isPassValid = this.newAccount.password.length > 0 && keyring.isPassValid(password);
  }

  public dropdownClick(type: string): void {
    if (type === 'raw') {
      this.generateSeed('raw');
      this.addressFromSeed('raw');
      this.validateRawSeed();
      this.validateSeed();
    }
    if (type === 'mnemonic') {
      this.generateSeed('mnemonic');
      this.addressFromSeed('mnemonic');
      this.validateMnemonic();
      this.validateSeed();
    }
  }

  public generateSeed(type: string): string {
    if (this.mode === 'accounts') {
      if (type === 'mnemonic') {
        return this.newAccount.mnemonicSeed = mnemonicGenerate();
      }
      if (type === 'raw') {
        return this.newAccount.rawSeed = u8aToHex(randomAsU8a());
      }
    }
    return '';
  }

  public isHexSeed(seed: string): boolean {
    return isHex(seed) && seed.length === 66;
  }

  public validateRawSeed(): boolean {
    return this.isValidRawSeed = ((this.newAccount.rawSeed.length > 0)
      && (this.newAccount.rawSeed.length <= 32)) || this.isHexSeed(this.newAccount.rawSeed);
  }

  public validateAddress(address: string): void {
    try {
      const keyringmagic = keyring.encodeAddress(keyring.decodeAddress(address));
      this.isAddressValid = keyring.isAvailable(keyringmagic);
    } catch (error) {
      this.isAddressValid = false;
    }
  }

  public checkAlreadyPresentAddress(address: string): void {
    if (this.mode === 'addressbook') {
      const keyringAddrs = Object.values(keyring.getAccounts());
      const alreadyExists = keyringAddrs.find((acc) => acc.address === address);
      if (alreadyExists) {
        this.toast('Already have same address in Keyring');
        this.uniqueAddress = false;
      }
      if (!alreadyExists) {
        this.uniqueAddress = true;
      }
    }
  }

  public validateSave(): void {
    if (this.mode === 'addressbook') {
      this.canSave = this.newAccount.address.length > 0 && this.isAddressValid
        && this.uniqueAddress && this.isNameValid;
    }

    if (this.mode === 'accounts') {
      this.canSave = this.isNameValid && this.isPassValid;
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
        tags: (this.newAccount.tags != null)?
          this.newAccount.tags.split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item) : null,
        whenCreated: Date.now() };
      if (this.mode === 'accounts') {
        if (this.seedType === 'mnemonic') {
          const { json, pair } =
            keyring.addUri(`${this.newAccount.mnemonicSeed}${this.newAccount.derivationPath}`,
            this.newAccount.password, meta, this.keypairType.selected);
        }
        if (this.seedType === 'raw') {
          const { json, pair } =
            keyring.addUri(`${this.newAccount.rawSeed}${this.newAccount.derivationPath}`,
            this.newAccount.password, meta, this.keypairType.selected);
        }
      }
      if (this.mode === 'addressbook') {
        const { json, pair } = keyring.addExternal(this.newAccount.address, meta);
      }

    } catch (error) {
      console.error(error);
    }
  }

  @Watch('$store.state.keyringLoaded')
  public addressFromSeed(type: string): string {
    if (this.mode === 'accounts') {
      if (type === 'mnemonic') {
        return this.newAccount.address =
        keyring.createFromUri(`${this.newAccount.mnemonicSeed.trim()}${this.newAccount.derivationPath}`,
          {}, this.keypairType.selected).address;
      }
      if (type === 'raw') {
        return this.newAccount.address =
        keyring.createFromUri(`${this.newAccount.rawSeed.trim()}${this.newAccount.derivationPath}`,
          {}, this.keypairType.selected).address;
      }
    }
    return '';
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public coldStart(): void {
    this.generateSeed('raw');
    this.generateSeed('mnemonic');
    this.validateMnemonic();
    this.validateSeed();
    if (this.isKeyringLoaded()) {
      this.addressFromSeed('raw');
      this.addressFromSeed('mnemonic');
    }
  }
  public mounted(): void {
    this.coldStart();
    this.mapAccounts();
  }
}
</script>
