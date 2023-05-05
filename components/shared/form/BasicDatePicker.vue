<template>
  <NeoField :label="$t(label)">
    <b-datepicker
      ref="datepicker"
      v-model="vValue"
      :expanded="expanded"
      :placeholder="placeholder">
    </b-datepicker>
    <b-button
      icon-left="calendar-today"
      type="is-primary"
      @click="$refs.datepicker.toggle()" />
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
export default class BasicDatePicker extends Vue {
  @VModel({ type: Date }) vValue!: Date
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: String, required: true }) placeholder!: string
  @Prop({ type: Boolean, default: false }) expanded!: boolean
}
</script>
