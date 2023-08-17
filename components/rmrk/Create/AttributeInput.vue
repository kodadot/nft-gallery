<template>
  <NeoField grouped>
    <NeoButton
      v-if="!disabled"
      no-shadow
      size="medium"
      icon-left="times"
      @click.native="remove" />
    <NeoInput
      v-model="vKey"
      placeholder="Section"
      expanded
      :disabled="disabled"
      spellcheck="true" />
    <NeoInput
      v-model="vValue"
      placeholder="Value"
      expanded
      spellcheck="true"
      :disabled="disabled" />
  </NeoField>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { NeoButton, NeoField, NeoInput } from '@kodadot1/brick'

@Component({
  components: {
    NeoButton,
    NeoField,
    NeoInput,
  },
})
export default class AttributeInput extends Vue {
  @Prop(Number) index!: number
  @Prop(Boolean) disabled!: boolean
  @PropSync('trait_type', { type: String }) vKey!: string
  @PropSync('value', { type: [String, Number] }) vValue!: string | number

  @Emit('remove')
  protected remove() {
    return this.index
  }
}
</script>
