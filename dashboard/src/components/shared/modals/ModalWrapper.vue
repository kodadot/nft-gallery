<template>
  <div>
    <button class="button is-primary" @click="isModalActive = true">
      {{ label }}
    </button>
    <b-modal :active.sync="isModalActive">
      <slot></slot>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ModalWrapper extends Vue {

  @Prop() public label!: string;
  private isModalActive: boolean = false;

}
</script>
