<template>
  <div class="h-full skeleton-container">
    <NeoSkeleton
      class="skeleton-backdrop"
      rounded
      border-radius="20px"
      no-margin
      full-size
      variant="k-grey-light" />

    <div class="skeleton-content flex">
      <NeoIcon
        icon="spinner-third"
        class="spinner has-text-k-grey mr-6"
        size="large"
        spin />

      <div>
        <p class="capitalize has-text-weight-bold is-size-6">
          {{ title || $t('general.doingSomeMagic') }}
        </p>
        <p class="capitalize is-size-6 has-text-k-grey">
          {{ subtitle || $t('general.pleaseWait') }}
          <span v-if="!subtitle" class="dots" />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoSkeleton } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {},
)
</script>

<style scoped lang="scss">
.skeleton {
  &-container {
    position: relative;
  }

  &-backdrop {
    z-index: 2;
  }

  &-content {
    display: flex;
    justify-content: center;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }
}
</style>
