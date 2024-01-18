<template>
  <div class="flex justify-between items-center mb-5">
    <div class="has-text-weight-bold is-size-5">
      {{ title }}
    </div>
    <slot>
      <div v-if="isPhaseOpen" class="flex items-center">
        <img src="/unlockable-pulse.svg" alt="open" />
        {{ $t('mint.unlockable.open') }}
      </div>
    </slot>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    isPhaseOpen: boolean
  }>(),
  {
    isPhaseOpen: false,
  },
)
</script>
