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
      <b-field label="address">
        <b-input v-model="newAccount.address"></b-input>
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
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import keyring from '@vue-polkadot/vue-keyring';
import Identicon from '@vue-polkadot/vue-identicon';

@Component({
  components: {
    Identicon,
  },
})
export default class Create extends Vue {
  @Prop(String) public theme!: string;

  public isPassValid: boolean = false;
  public newAccount: any = {
    name: 'new account',
    tags: '',
    address: '',
  };

  @Emit()
  public onCreate(): void {
    try {
      const meta = {
        name: this.newAccount.name,
        tags: this.newAccount.tags.split(','),
        whenCreated: Date.now() };
      const { json, pair } = keyring.addExternal(this.newAccount.address, meta);
    } catch (error) {
      console.error(error);
    }
  }

}
</script>