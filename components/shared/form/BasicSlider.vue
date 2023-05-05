<template>
  <NeoField class="mt-4" :label="$t(label)" label-position="">
    <b-slider
      v-model="vValue"
      :min="min"
      :max="max"
      :ticks="ticks"
      :custom-formatter="customFormatter"
      :lazy="lazy" />
  </NeoField>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator'
import { NeoField } from '@kodadot1/brick'

@Component({
  components: {
    NeoField,
  },
})
export default class BasicSlider extends Vue {
  @VModel({ type: Number, required: true }) vValue!: number
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: Number, default: 0 }) min!: number
  @Prop({ type: Number, default: 100 }) max!: number
  @Prop(Boolean) ticks!: boolean
  @Prop(Boolean) lazy!: boolean
  @Prop({ type: Function, required: false }) customFormatter!: (
    v: string
  ) => string
}
</script>
