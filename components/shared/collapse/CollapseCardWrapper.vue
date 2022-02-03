<template>
  <div class="block">
    <b-collapse
      class="card bordered"
      animation="slide"
      aria-id="contentIdForHistory"
      :open="isOpen">
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForHistory">
          <p class="card-header-title">
            {{ $t(label) }}
          </p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </b-icon>
          </a>
        </div>
      </template>
      <div class="card-content">
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class CollapseCardWrapper extends Vue {
  @Prop({ type: String, default: 'label' }) label!: string
  protected isOpen = false
}
</script>
