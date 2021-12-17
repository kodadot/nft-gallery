<template>
  <b-field>
    <b-switch
      v-model="isSwitched"
      :rounded="false"
      :size="size"
      :class="labelColor"
    >
      {{ properLabel }}
    </b-switch>
  </b-field>
</template>

<script lang="ts" >
import { TranslateResult } from 'vue-i18n'
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator'

@Component
export default class BasicSwitch extends Vue {
  @VModel({ type: Boolean, required: true }) isSwitched!: string
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: String }) offLabel!: string
  @Prop({ type: String }) size!: string
  @Prop({ type: String }) labelColor!: string

  get properLabel(): TranslateResult {
    const offLabel = this.offLabel || this.label
    return this.$t(this.isSwitched ? this.label : offLabel)
  }
}
</script>
