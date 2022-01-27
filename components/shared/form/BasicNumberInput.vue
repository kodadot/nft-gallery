<template>
  <b-field :label="$t(label)">
    <b-numberinput
      :placeholder="placeholder"
      v-model="vValue"
      :expanded="expanded"
      @blur="hasFocus = false"
      @focus="hasFocus = true"
      :min="1"
      :max="max" />
    <template #message>
      <transition name="fade">
        <span v-show="hasFocus && message" class="has-text-primary is-italic">{{
          message
        }}</span>
      </transition>
    </template>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator'

@Component
export default class BasicInput extends Vue {
  // Dev: make vValue required
  @VModel({ type: Number }) vValue!: number
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: String, required: true }) placeholder!: string
  @Prop({ type: Boolean, default: false }) expanded!: boolean
  @Prop({ type: String }) message!: string
  @Prop({ type: Number, required: false }) max!: number

  protected hasFocus = false
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
