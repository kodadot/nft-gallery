<template>
  <tippy class="w-full inline-block" :placement="placement" :delay="delay">
    <slot name="content" />

    <template #content>
      <div class="shadow-primary border border-border-color max-w-[350px] p-4">
        <slot />
      </div>
    </template>
  </tippy>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    delay?: [number, number]
    placement?: string
  }>(),
  {
    delay: () => [100, 800],
    placement: 'bottom',
  },
)
</script>
