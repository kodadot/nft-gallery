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
            {{newAccount.address.slice(0,6)}}...{{newAccount.address.slice(-6)}}
          </b-field>
        </b-field>
      </div>
      <b-field label="name">
        <b-input v-model="newAccount.name"></b-input>
      </b-field>
      <b-field label="mnemonic seed" v-bind:type="{ 'is-danger': !isValidMnemonic }">
        <b-input v-model="newAccount.mnemonicSeed"
          @input="validateMnemonic()"
          :expanded='true'>
        </b-input>
        <p class="control">
          <button class="button is-primary" 
            @click="generateSeed(); addressFromSeed(); validateMnemonic()">
            <font-awesome-icon icon="sync"/>
             Mnemonic
          </button>
        </p>
      </b-field>
      <b-field label="password">
        <b-input v-model="newAccount.password" password-reveal></b-input>
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
        <b-field label="tags">
          <b-input v-model="newAccount.tags"></b-input>
        </b-field>
      </b-field>
      
      <b-field label="secret derivation path">
        <b-input v-model="newAccount.derivationPath"></b-input>
      </b-field>
    </section>
    <div>
      <b-button 
        type="is-primary"
        @click="onCreate">Create
      </b-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
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
  // will be replaced by uiSettings
  public keypairType: any = {
    selected: 'sr25519',
    options: [
      { text: 'Schnorrkel (sr25519)', value: 'sr25519' },
      { text: 'Edwards (ed25519)', value: 'ed25519' },
    ],
  };


  public isValidMnemonic: boolean = false;
  public newAccount: any = {
    password: '0000',
    name: 'new account',
    tags: '',
    mnemonicSeed: 'states imitate exhibit age urban pet silver behave erase salute slogan office',
    keypairType: this.keypairType,
    derivationPath: '',
    address: '',
  };

  public validateMnemonic(): void {
    this.isValidMnemonic = mnemonicValidate(this.newAccount.mnemonicSeed);
  }

  public generateSeed(): string {
    return this.newAccount.mnemonicSeed = mnemonicGenerate();
  }

  public onCreate(): void {
    try {
      const meta = {
        name: this.newAccount.name,
        tags: this.newAccount.tags.split(','),
        whenCreated: Date.now() };
      const { json, pair } = keyring.addUri(`${this.newAccount.mnemonicSeed}${this.newAccount.derivationPath}`,
        this.newAccount.password, meta, this.keypairType.selected);
      this.$emit('refreshAccounts');
    } catch (error) {
      console.error(error);
    }
  }

  public addressFromSeed(): any {
    return this.newAccount.address = keyring.createFromUri(`${this.newAccount.mnemonicSeed.trim()}${this.newAccount.derivationPath}`,
      {}, this.keypairType.selected).address;
  }
  public mounted(): void {
    this.generateSeed();
  }
}
</script>