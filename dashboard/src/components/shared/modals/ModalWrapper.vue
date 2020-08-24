<template>
  <div>
    <b-button
      class="button"
      :type="buttonType"
      :icon-left="icon"
      :expanded="expanded"
      @click="isModalActive = true"
    >
      <template v-if="label">{{ label }}</template>
    </b-button>
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ModalWrapper extends Vue {

  @Prop() public label!: string;
  @Prop() public icon!: string;
  @Prop() public type!: string;
  @Prop() public expanded!: boolean;
  private isModalActive: boolean = false;

  get buttonType() {
    return this.type || 'is-primary';
  }

}
</script>
