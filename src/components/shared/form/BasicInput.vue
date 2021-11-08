<template>
  <b-field :label="$t(label)">
    <b-input
      :placeholder="placeholder"
      v-model="vValue"
      :expanded="expanded"
      @blur="hasFocus = false"
      @focus="hasFocus = true"
      :maxlength="maxlength"
      :type="type"
    />
    <template #message>
      <transition name="fade">
        <span v-show="hasFocus && message" class="has-text-primary is-italic">{{
          message
        }}</span>
      </transition>
    </template>
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, VModel, Vue } from 'vue-property-decorator'

@Component
export default class BasicInput extends Vue {
  // Dev: make vValue required
  @VModel({ type: String }) vValue!: string;
  @Prop({ type: String, required: true }) label!: string;
  @Prop({ type: String, required: true }) placeholder!: string;
  @Prop({ type: Boolean, default: false }) expanded!: boolean;
  @Prop({ type: String }) message!: string;
  @Prop({ type: String, required: false }) maxlength!: string;
  @Prop({ type: String, required: false }) type!: string;

  protected hasFocus = false;
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
