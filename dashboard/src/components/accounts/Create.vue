<template>
  <div id="createAccount">
    <section>
      <div>
        identicon
        {{newAccount.name.toUpperCase()}}
        ss58address
      </div>
      <b-field label="name">
        <b-input v-model="newAccount.name"></b-input>
      </b-field>
      <b-field label="mnemonic seed">
        <b-input v-model="newAccount.mnemonicSeed"></b-input>
        <p class="control">
          <button class="button is-primary">
            <font-awesome-icon icon="sync"/>
             Mnemonic
          </button>
        </p>
      </b-field>
      <b-field label="password">
        <b-input v-model="newAccount.password" password-reveal></b-input>
      </b-field>
      <b-field label="keypair crypto type">
        <b-select v-model="keypairType.selected">
          <option v-for="opt in keypairType.options"
            v-bind:key="opt.value"
            v-bind:value="opt.value">
            {{ opt.text }}
          </option>
        </b-select>
      </b-field>
      <b-field label="secret derivation path">
        <b-input v-model="newAccount.derivationPath"></b-input>
      </b-field>
    </section>
    <div>
      
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';

@Component({
  components: {
    Identicon,
  },
})
export default class Create extends Vue {
  public keypairType: object = {
    selected: 'sr25519',
    options: [
      { text: 'Schnorrkel (sr25519)', value: 'sr25519' },
      { text: 'Edwards (ed25519)', value: 'ed25519' },
    ],
  };

  public createPassword: string = '';
  public newAccount: object = {
    password: '',
    name: 'new account',
    mnemonicSeed: '',
    keypairType: this.keypairType,
    derivationPath: '',
  };
}
</script>