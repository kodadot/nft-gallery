<template>
  <div id="Keypair">
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
            {{address.slice(0, 6)}}…{{address.slice(-6)}}
              <b-button
              size="is-small" 
              icon-left="copy" 
              v-clipboard:copy="address"
              @click="toast('Address copied to clipboard')">
              </b-button><br>
            {{publicKey.slice(0, 6)}}..{{publicKey.slice(-6)}} || {{type}}
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
          <b-button type="is-light" icon-left="cloud-download-alt"></b-button>
          <b-button type="is-light" icon-left="key"></b-button>
          <b-button type="is-light" icon-left="paper-plane">Send</b-button>
        </b-field>
        <Backup v-if="!meta.isTesting"
          :address="address"
          :password="password" />
        <ChangePass v-if="address && !meta.isTesting"
          :address="address" />
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
  @Prop(String) public address!: string;
  @Prop(String) public publicKey!: string;
  @Prop(String) public type!: string;
  @Prop({ default: 'no-meta'}) public meta!: string;
  @Prop({ default: 'polkadot'}) public theme!: string;
  @Prop({ default: 64 }) public size!: number;
  // temporary prop
  @Prop(String) public password!: string;

  @Emit()
  public forgetAccount(address: string): void {
    keyring.forgetAccount(address);
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message);
  }
}
</script>
