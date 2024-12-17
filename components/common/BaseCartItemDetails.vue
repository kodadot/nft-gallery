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

        <div class="flex flex-col justify-between ml-4 w-[100px] md:w-[170px]">
          <div
            class="font-bold leading-none whitespace-nowrap is-clipped is-ellipsis"
            :class="[discarded ? 'text-k-grey' : 'text-text-color']"
          >
            {{ name }}
          </div>
          <div
            class="leading-none whitespace-nowrap is-clipped is-ellipsis"
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
