<template>
  <div v-show="list.timestamp || list.price" class="card-footer">
    <div class="is-flex p-2">
      <time v-if="list.timestamp" class="is-size-7 icon-text">
        <b-icon icon="clock" />
        <span>{{ list.timestamp }}</span>
      </time>
      <div v-if="list.price" class="ml-auto">
        <Money :value="list.price" inline />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '@/components/base/types'
import Money from '@/components/shared/format/Money.vue'

defineProps<{
  list: CarouselNFT
}>()
</script>

<style lang="scss" scoped>
.card-footer {
  border-top-color: hsla(0, 0%, 60%, 1);
  .is-flex {
    flex: auto;
  }
}
</style>
