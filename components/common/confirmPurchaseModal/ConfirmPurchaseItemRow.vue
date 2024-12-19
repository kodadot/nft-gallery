<template>
  <div class="flex justify-between">
    <div class="flex pr-2">
      <div>
        <slot name="image">
          <BasicImage
            :src="image"
            :alt="name"
            class="border image is-48x48"
          />
        </slot>
      </div>

      <div class="flex flex-col justify-center ml-4 w-[100px] md:w-[170px]">
        <div
          class="font-bold text-text-color leading-none whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {{ name }}
        </div>
        <div
          v-if="!hideCollection"
          class="leading-none whitespace-nowrap overflow-hidden text-ellipsis mt-2"
        >
          {{ collectionName }}
        </div>
      </div>
    </div>

    <div class="flex items-end whitespace-nowrap leading-none">
      <CommonTokenMoney :value="price" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

defineProps<{
  name: string
  collectionName: string
  price: string
  sn?: string
  image?: string
  hideCollection?: boolean
}>()
</script>
