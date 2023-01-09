<template>
  <div :id="id">
    <slot name="trigger" :handle-open="handleOpen">
      <b-button
        :type="type"
        :icon-left="icon"
        :expanded="expanded"
        :class="{
          'modal-wrapper-button__right': isRight,
          'is-invisible': isButtonHidden,
        }"
        @click="handleOpen">
        <template v-if="label">{{ label }}</template>
      </b-button>
    </slot>
    <b-modal :active.sync="isModalActive">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            {{ label || title }}
          </p>
          <slot name="hint" />
        </header>
        <div class="card-content">
          <slot></slot>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ModalWrapper extends Vue {
  @Prop(String) public label!: string
  @Prop(String) public title!: string
  @Prop(String) public icon!: string
  @Prop(String) public type?: string
  @Prop(Boolean) public expanded!: boolean
  @Prop(Boolean) public isRight!: boolean
  @Prop({ default: '' }) public id!: string
  @Prop({ default: false }) public isButtonHidden!: boolean

  private isModalActive = false

  protected handleOpen() {
    this.isModalActive = true
  }
}
</script>

<style scoped>
.modal-wrapper-button__right {
  float: right;
}
</style>
