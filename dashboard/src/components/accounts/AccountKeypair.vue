<template>
  <div id="AccountKeypair">
      <div>
        <Identicon
          :value="address"
          :theme="theme"
          :size="size"
        />
      </div>
      <div>
        {{meta.name}}
        <b-tag v-if="meta.tags">{{meta.tags}}</b-tag>
        <b-tag type="is-dark" 
          v-if="meta.isTesting">testing account</b-tag>
      </div>
      <div>
        {{address.slice(0, 6)}}…{{address.slice(-6)}}
      </div>
      <div>
        publicKey {{publicKey.slice(0, 6)}}..{{publicKey.slice(-6)}}
      </div>
      <div>
        type: {{type}}
        {{meta}}
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
export default class Keypair extends Vue {
  @Prop(String) public address!: string;
  @Prop(String) public publicKey!: string;
  @Prop(String) public type!: string;
  @Prop({ default: 'no-meta'}) public meta!: string;
  @Prop({ default: 'polkadot'}) public theme!: string;
  @Prop({ default: 64 }) public size!: number;
}
</script>
