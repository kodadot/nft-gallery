<template>
  <o-collapse
    class="neo-collapse max-w-full relative rounded-none shadow-none border-b border-b-border-color"
    :class="{ 'pointer-events-none cursor-default bg-k-shade': disabled }"
    animation="slide"
    :open="false"
    content-class="collapse-content">
    <template #trigger="props">
      <button
        class="rounded-none flex items-stretch w-full cursor-pointer text-base p-0"
        type="button"
        :class="{
          'bg-background-color-inverse group active': props.open,
          'bg-transparent': !props.open,
        }">
        <p
          class="text-text-color group-[.active]:text-text-color-inverse font-bold p-3 m-0 flex justify-center items-center grow px-7">
          <slot />
        </p>
        <a
          class="text-text-color group-[.active]:text-text-color-inverse absolute right-0 flex justify-center items-center">
          <o-icon :icon="props.open ? 'chevron-up' : 'chevron-down'"> </o-icon>
        </a>
      </button>
    </template>
    <div class="p-0 bg-transparent text-text-color">
      <div class="content">
        <slot name="content" />
      </div>
    </div>
  </o-collapse>
</template>

<script lang="ts" setup>
import { OCollapse, OIcon } from '@oruga-ui/oruga-next'
defineProps<{
  disabled?: boolean
}>()
</script>
