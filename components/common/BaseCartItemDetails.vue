<template>
  <div>
    <div class="flex justify-between">
      <div class="flex">
        <div>
          <slot name="image">
            <BasicImage
              :src="image"
              :alt="name"
              class="border image is-48x48"
              :class="{ 'opacity-50': discarded }"
            />
          </slot>
        </div>

        <div class="flex flex-col justify-between ml-4 limit-width">
          <div
            class="font-bold line-height-1 whitespace-nowrap is-clipped is-ellipsis"
            :class="[discarded ? 'text-k-grey' : 'text-text-color']"
          >
            {{ name }}
          </div>
          <div
            class="line-height-1 whitespace-nowrap is-clipped is-ellipsis"
            :class="{ 'text-k-grey': discarded }"
          >
            {{ secondName }}
          </div>
        </div>
      </div>

      <slot name="right" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  name: string
  secondName?: string
  discarded?: boolean
}>()
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.limit-width {
  width: 170px;
  @include mobile {
    width: 100px;
  }
}

.line-height-1 {
  line-height: 1;
}
</style>
