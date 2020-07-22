<template>
  <div id="TxPicker">
    <b-field>
        <p class="control">
          <Identicon
            :value="address"
            :theme="theme"
            :size="size" />
        </p>
        <b-field :label="label">
          <b-select :placeholder="placeholder" v-model="pickedAddress">
            <optgroup v-for="acc in keyringAccounts"
              v-bind:key="acc.name"
              v-bind:value="acc.address"
              :label="shortAddress(acc.address)">
              <option v-if="direction === 'to'" 
                :value="acc.address">
                {{acc.meta.name}}
              </option>
              <option v-if="direction === 'from' && !acc.meta.isExternal" 
                :value="acc.address">
                {{acc.meta.name}}
              </option>
            </optgroup>
          </b-select>
        </b-field>
        <b-field label="Available Amount">
          <b-input :value="balance" disabled></b-input>
        </b-field>
    </b-field>
<b-field>
  <p class="control">
  <Identicon
    :value="address"
    :theme="theme"
    :size="size" />
  </p>
  <b-dropdown v-model="pickedAddress" aria-role="list">
        <button class="button is-large is-light" slot="trigger"> 
          <span v-if="pickedAddress">
            <!-- {{shortAddress(pickedAddress)}} -->
            {{pickedMetaName}}
          </span>
          <span v-else>
            {{label}}
          </span>
          <b-icon icon="caret-down"></b-icon>
        </button>
        <p v-for="acc in keyringAccounts"
              v-bind:key="acc.name"
              v-bind:value="acc.address">
          <b-dropdown-item v-if="direction === 'from' && !acc.meta.isExternal" 
            :value="acc.address" @click="setMeta(acc.meta.name)" aria-role="listitem">
              <div class="media">
                  <Identicon
                    :value="acc.address"
                    :theme="theme"
                    :size="48" />
                  <div class="media-content">
                      <h3>{{setMeta(acc.meta.name)}}</h3>
                      <small>{{shortAddress(acc.address)}}</small>
                  </div>
              </div>
          </b-dropdown-item>
          <b-dropdown-item v-if="direction === 'to'" 
            :value="acc.address" @click="setMeta(acc.meta.name)" aria-role="listitem">
              <div class="media">
                  <Identicon
                    :value="acc.address"
                    :theme="theme"
                    :size="48" />
                  <div class="media-content">
                      <h3>{{acc.meta.name}}</h3>
                      <small>{{shortAddress(acc.address)}}</small>
                  </div>
              </div>
          </b-dropdown-item>
        </p>
    </b-dropdown>
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
  @Prop(String) public placeholder!: string;
  @Prop(String) public theme!: string;
  @Prop(String) public direction!: string;
  @Prop() public keyringAccounts!: any;
  @Prop() public balance!: any;
  @Prop({ default: 56 }) public size!: number;

  @PropSync('address', { type: String }) public pickedAddress!: string;
  private pickedMetaName: string = '';
  public shortAddress(address: string): string {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return '';
  }

  public setMeta(metaName: string) {
    this.pickedMetaName = metaName;
    return this.pickedMetaName;
  }
}
</script>