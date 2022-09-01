<template>
  <div>
    <b-field :type="type" :message="err" :label="$t(label)">
      <b-input
        ref="address"
        v-model="inputValue"
        :icon-right="iconRight"
        icon-right-clickable
        @input="handleInput"
        @icon-right-click="clearIconClick" />
    </b-field>
  </div>
</template>

<script lang="ts">
import correctFormat from '@/utils/ss58Format'
import { checkAddress, isAddress } from '@polkadot/util-crypto'
import { Debounce } from 'vue-debounce-decorator'
import { Component, Emit, Prop, Ref, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { ss58Of } from '@/utils/config/chain.config'

@Component({})
export default class AddressInput extends mixins(PrefixMixin) {
  @Prop(String) public value!: string
  private err: string | null = ''
  @Prop({ type: String, default: 'insert address' }) public label!: string
  @Prop(Boolean) public emptyOnError!: boolean
  @Prop({ type: Boolean, default: true }) public strict!: boolean
  @Prop({ type: String, default: '' }) public icon?: string

  @Ref('address') readonly address

  get inputValue(): string {
    return this.value
  }

  set inputValue(value: string) {
    this.handleInput(value)
  }

  // hide close-circle if nothing was input
  get iconRight(): string {
    if (this.inputValue && this.icon === 'close-circle') {
      return 'close-circle'
    }
    return ''
  }

  get type(): string {
    return this.err ? 'is-danger' : ''
  }

  public focusInput(): void {
    this.address?.focus()
  }

  private clearIconClick() {
    this.inputValue = ''
  }

  @Debounce(300)
  @Emit('input')
  protected handleInput(value: string) {
    if (this.strict) {
      const [, err] = checkAddress(value, correctFormat(this.ss58Format))
      this.err = value ? err : ''
    } else {
      if (!this.emptyOnError && !value) {
        this.err = ''
      } else {
        this.err = isAddress(value) ? '' : 'Invalid address'
      }
    }

    return this.emptyOnError && this.err ? '' : value
  }

  get ss58Format(): number {
    return ss58Of(this.urlPrefix)
  }
}
</script>
