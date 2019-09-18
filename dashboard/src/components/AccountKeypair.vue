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
        {{meta}}
      </div>
      <div>
        {{address}}
      </div>
      <div>
        {{publicKey}}
      </div>
      <div>
        {{type}}
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
  @Prop() public publicKey!: any;
  @Prop(String) public type!: string;
  @Prop({ default: 'no-meta'}) public meta!: string;
  @Prop({ default: 'polkadot'}) public theme!: string;
  @Prop({ default: 64 }) public size!: number;
}
</script>
