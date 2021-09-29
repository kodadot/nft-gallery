<template>
  <div>
    <slot name="trigger" v-bind:handleOpen="handleOpen">
      <b-button
        class="button"
        :type="buttonType"
        :icon-left="icon"
        :expanded="expanded"
        @click="handleOpen"
        :class="{ 'modal-wrapper-button__right': isRight }"
      >
        <template v-if="label">{{ label }}</template>
      </b-button>
    </slot>
    <b-modal :active.sync="isModalActive">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            {{ label }}
          </p>
        </header>
        <div class="card-content">
          <slot></slot>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class ModalWrapper extends Vue {
  @Prop(String) public label!: string;
  @Prop(String) public icon!: string;
  @Prop(String) public type!: string;
  @Prop(Boolean) public expanded!: boolean;
  @Prop(Boolean) public isRight!: boolean;
  private isModalActive = false;

  get buttonType() {
    return this.type || 'is-primary'
  }

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
