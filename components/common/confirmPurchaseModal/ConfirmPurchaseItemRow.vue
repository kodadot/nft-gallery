<template>
  <div class="flex justify-between">
    <div class="flex pr-2">
      <div>
        <slot name="image">
          <BasicImage :src="image" :alt="name" class="border image is-48x48" />
        </slot>
      </div>

      <div class="flex flex-col justify-between ml-4 limit-width">
        <div
          class="has-text-weight-bold has-text-color line-height-1 no-wrap is-clipped ellipsis">
          {{ name }}
        </div>
        <div class="line-height-1 no-wrap is-clipped ellipsis">
          {{ collectionName }}
        </div>
      </div>
    </div>

    <div class="flex items-end no-wrap line-height-1">
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
  image?: string
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

.ellipsis {
  text-overflow: ellipsis;
}

.line-height-1 {
  line-height: 1;
}
</style>
