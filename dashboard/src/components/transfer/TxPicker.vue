<template>
  <div id="TxPicker">
    <b-field>
        <p class="control">
          <Identicon
            :value="address"
            :theme="theme"
            :size="56" />
        </p>
        <b-field :label="label">
          <b-select v-model="pickedAddress">
            <optgroup v-for="acc in keyringAccounts"
              v-bind:key="acc.name"
              v-bind:value="acc.address"
              :label="acc.address.slice(0,20)">
              <option :value="acc.address">
                {{acc.meta.name}}
              </option>
            </optgroup>
          </b-select>
        </b-field>
        <b-field label="Available Amount">
          <b-input :value="balance" disabled></b-input>
        </b-field>
    </b-field>
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch, Emit } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
@Component({
  components: {
    Identicon,
  },
})
export default class TxPicker extends Vue {
  @Prop(String) public label!: string;
  @Prop(String) public theme!: string;
  @Prop() public keyringAccounts!: any;
  @Prop() public balance!: any;
  @PropSync('address', { type: String }) public pickedAddress!: string;
}
</script>