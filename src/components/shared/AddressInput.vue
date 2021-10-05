<template>
  <div>
    <b-field :type="type" :message="err" :label="$t(label)">
      <b-input v-model="inputValue" @input="handleInput"></b-input>
    </b-field>
  </div>
</template>

<script lang="ts">
import correctFormat from '@/utils/ss58Format'
import { checkAddress } from '@polkadot/util-crypto'
import { Debounce } from 'vue-debounce-decorator'
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class AddressInput extends Vue {
  @Prop(String) public value!: string;
  private err: string | null = '';
  @Prop({ type: String, default: 'insert address' }) public label!: string;
  @Prop(Boolean) public emptyOnError!: boolean;

  get inputValue(): string {
    return this.value
  }

  set inputValue(value: string) {
    this.handleInput(value)
  }

  get type() {
    return this.err ? 'is-danger': ''
  }

  @Debounce(500)
  @Emit('input')
  protected handleInput(value: string) {
    const [, err] = checkAddress(value, correctFormat(this.ss58Format))
    this.err = value ? err : ''

    return this.emptyOnError && this.err ? '' : value
  }

  get ss58Format(): number {
    return this.$store.getters.getChainProperties?.ss58Format
  }
}
</script>
