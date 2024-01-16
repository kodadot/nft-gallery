<template>
  <div>
    <ModalIdentityItem />
  </div>

  <slot>
    <div class="py-5 flex items-start">
      <NeoIcon icon="lightbulb" size="small" class="mr-2 is-block" />
      <p
        v-dompurify-html="$t('autoTeleport.tip')"
        class="is-size-7 capitalize" />
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
