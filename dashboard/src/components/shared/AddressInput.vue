<template>
  <div>
    <b-field :label="$t(label)">
      <b-input type="is-danger" v-model="value" @input="handleInput" :message="err"></b-input>
    </b-field>
  </div>
</template>

<script lang="ts">
import { checkAddress } from '@polkadot/util-crypto';
import { Debounce } from 'vue-debounce-decorator';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class AddressInput extends Vue {

  private value: string = '';
  private err: string | null = '';
  @Prop({ default: 'insert address' }) public label!: string;

  @Debounce(500)
  @Emit('input')
  protected handleInput(value: string) {
    const [valid, err] = checkAddress(value, this.ss58Format);
    this.err = err;

    if (valid) {
      return value
    }

    return ''
  }

  get ss58Format(): number {
    return this.$store.getters.getChainProperties?.ss58Format
  }
}
</script>
