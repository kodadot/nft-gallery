<template>
  <b-field>
    <NeoCheckbox v-model="isChecked" :disabled="disabled">
      {{ $t(label) }}
    </NeoCheckbox>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator'
import { NeoCheckbox } from '@kodadot1/brick'

@Component
export default class BasicCheckbox extends Vue {
  @VModel({ type: Boolean, required: true }) isChecked!: string
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: Boolean }) disabled!: string
}
</script>
