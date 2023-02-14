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
            <b-icon :icon="props.open ? 'chevron-up' : 'chevron-down'" />
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

<script lang="ts" setup>
withDefaults(
  defineProps<{
    label: string
  }>(),
  {
    label: 'label',
  }
)
const isOpen = ref(false)
</script>
