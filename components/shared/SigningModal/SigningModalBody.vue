<template>
  <div>
    <ModalIdentityItem />
  </div>

  <slot>
    <div class="py-5 flex items-start">
      <NeoIcon icon="lightbulb" size="small" class="mr-2 !block" />
      <p v-dompurify-html="$t('autoTeleport.tip')" class="text-xs capitalize" />
    </div>
  </slot>

  <div class="h-[200px]">
    <SkeletonLoader
      :title="title"
      :subtitle="subtitle"
      :with-dots="showSubtitleDots"
      solid />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    title: string
    subtitle: string
    showSubtitleDots?: boolean
  }>(),
  {
    showSubtitleDots: false,
  },
)
</script>
