<template>
  <NeoField>
    <b-switch
      v-model="isSwitched"
      :rounded="false"
      :size="size"
      :disabled="disabled"
      :class="labelColor"
      :type="type"
      data-cy="buy-now">
      <component :is="componentName" :label="message">
        {{ properLabel }}
      </component>
    </b-switch>
  </NeoField>
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n'
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator'
import { NeoField } from '@kodadot1/brick'
@Component({
  components: {
    NeoField,
  },
})
export default class BasicSwitch extends Vue {
  @VModel({ type: Boolean, required: true }) isSwitched!: string
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: String }) offLabel!: string
  @Prop({ type: String }) size!: string
  @Prop({ type: String }) type!: string
  @Prop({ type: String }) labelColor!: string
  @Prop({ type: String }) message!: string
  @Prop(Boolean) public disabled!: boolean

  get componentName(): string {
    return this.message ? 'b-tooltip' : 'span'
  }

  get properLabel(): TranslateResult {
    const offLabel = this.offLabel || this.label
    return this.$t(this.isSwitched ? this.label : offLabel)
  }
}
</script>
