<template>
  <b-field :label="$t(label)">
    <b-input
      ref="input"
      v-model="vValue"
      :placeholder="placeholder"
      :expanded="expanded"
      :maxlength="maxlength"
      :required="required"
      :disabled="disabled"
      :type="type"
      @blur="hasFocus = false"
      @focus="hasFocus = true" />
    <template v-if="hasFocus && message" #message>
      <transition name="fade">
        <span class="has-text-primary is-italic">{{ message }}</span>
      </transition>
    </template>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, Ref, VModel, Vue } from 'nuxt-property-decorator'

@Component
export default class BasicInput extends Vue {
  // Dev: make vValue required
  @VModel({ type: String }) vValue!: string
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: String, required: true }) placeholder!: string
  @Prop({ type: Boolean, default: false }) expanded!: boolean
  @Prop({ type: String }) message!: string
  @Prop({ type: String, required: false }) maxlength!: string
  @Prop({ type: String, required: false }) type!: string
  @Prop({ type: Boolean, default: false }) required!: boolean
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Ref('input') readonly input
  protected hasFocus = false
  public checkValidity() {
    return this.input.checkHtml5Validity()
  }
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
