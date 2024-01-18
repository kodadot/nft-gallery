<template>
  <div class="flex justify-between items-center mb-5">
    <dib class="flex gap-5 items-center">
      <div class="has-text-weight-bold is-size-5">
        {{ title }}
      </div>

      <div v-if="subtitle" class="text-k-grey is-size-6">
        {{ subtitle }}
      </div>
    </dib>

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
    subtitle?: string
    isPhaseOpen: boolean
  }>(),
  {
    isPhaseOpen: false,
  },
)
</script>
