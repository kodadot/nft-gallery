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

  <div class="min-height">
    <SkeletonLoader :title="title" :subtitle="subtitle" solid />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<style lang="scss" scoped>
.min-height {
  height: 200px;
}
</style>
