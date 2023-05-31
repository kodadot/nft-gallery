<template>
  <NeoField :label="$t(label)">
    <b-numberinput
      v-model="vValue"
      :placeholder="placeholder"
      :expanded="expanded"
      :step="step"
      :min-step="minStep"
      :min="min"
      :max="max"
      @blur="hasFocus = false"
      @focus="hasFocus = true" />
    <template #message>
      <transition name="fade">
        <span v-show="hasFocus && message" class="has-text-primary is-italic">{{
          message
        }}</span>
      </transition>
    </template>
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
export default class BasicNumberInput extends Vue {
  // Dev: make vValue required
  @VModel({ type: Number }) vValue!: number
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: String, required: false }) placeholder!: string
  @Prop({ type: Boolean, default: false }) expanded!: boolean
  @Prop({ type: String }) message!: string
  @Prop({ type: Number, required: false }) max!: number
  @Prop({ type: Number, required: false, default: 1 }) min!: number
  @Prop({ type: Number, required: false, default: 1 }) step!: number
  @Prop({ type: Number, required: false }) minStep!: number

  public hasFocus = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
