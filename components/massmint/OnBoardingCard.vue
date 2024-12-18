<template>
  <div
    class="carousel-card p-7 mobile-padding"
    :class="{ 'not-active': !active }"
  >
    <div class="card__content">
      <div class="flex justify-between">
        <p class="title text-xl sm:text-3xl capitalize">
          {{ title }}
        </p>
        <span class="text-2xl">{{ count }}</span>
      </div>
      <slot>
        <div class="content text-xl/[1.5] sm:text-base/[1.5]">
          <Markdown :source="content" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  count?: string
  content?: string
  active?: boolean
}>()
</script>
