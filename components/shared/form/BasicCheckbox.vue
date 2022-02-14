<template>
  <b-field>
    <b-checkbox v-model="isChecked" :disabled="disabled">
      {{ $t(label) }}
    </b-checkbox>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator'

@Component
export default class BasicCheckbox extends Vue {
  @VModel({ type: Boolean, required: true }) isChecked!: string
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: Boolean }) disabled!: string
}
</script>
