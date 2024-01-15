<template>
  <div class="h-full skeleton-container">
    <div
      v-if="solid"
      class="relative w-full h-full rounded-[1.25rem] bg-k-grey-light" />

    <NeoSkeleton
      v-else
      class="skeleton-backdrop"
      rounded
      border-radius="20px"
      no-margin
      full-size
      variant="k-grey-light" />

    <div class="skeleton-content flex">
      <NeoIcon
        icon="spinner-third"
        class="spinner text-k-grey mr-6"
        size="large"
        spin />

      <div>
        <p class="capitalize has-text-weight-bold is-size-6">
          {{ title || $t('general.doingSomeMagic') }}
        </p>
        <p class="capitalize is-size-6 text-k-grey">
          {{ subtitle || $t('general.pleaseWait') }}
          <span v-if="showDots" class="dots" />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoSkeleton } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    withDots?: boolean
    solid?: boolean
  }>(),
  {
    withDots: false,
    solid: false,
  },
)

const showDots = computed(() => props.withDots || !props.subtitle)
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
