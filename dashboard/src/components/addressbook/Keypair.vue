<template>
  <div id="AddressBookKeypair">
      <div>
        <b-field grouped>
          <b-field>
            <Identicon
              :value="address"
              :theme="theme"
              :size="size" />
          </b-field>
          <b-field grouped multiline>
            {{meta.name}} <br>
            {{address.slice(0, 6)}}…{{address.slice(-6)}}<br>
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
          </b-field>
        </b-field>
      </div>
      <div>
        <b-field grouped multiline>
          <b-button type="is-warning" icon-left="trash" 
            @click="forgetAccount(address)">
          </b-button>
          <b-button type="is-light" icon-left="paper-plane">Send</b-button>
        </b-field>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';

@Component({
  components: {
    Identicon,
  },
})
export default class Keypair extends Vue {
  @Prop(String) public address!: string;
  @Prop({ default: 'no-meta'}) public meta!: string;
  @Prop({ default: 'substrate'}) public theme!: string;
  @Prop({ default: 64 }) public size!: number;

  @Emit()
  public forgetAccount(address: string): void {
    keyring.forgetAccount(address);
  }
}
</script>
