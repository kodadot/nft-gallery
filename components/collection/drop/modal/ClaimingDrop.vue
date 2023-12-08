<template>
  <div>
    <ModalIdentityItem />
  </div>

  <p class="py-5 is-capitalized">
    {{ $t('drops.stayTuned') }}
  </p>

  <div class="min-height">
    <SkeletonLoader :title="$t('drops.preparingYourNft')" :subtitle="est" />
  </div>
</template>

<script setup lang="ts">
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import SkeletonLoader from '@/components/shared/SkeletonLoader.vue'

const props = defineProps<{ est: string }>()

const est = computed(() => `Est ~ ${props.est}`)
</script>

<style lang="scss" scoped>
.min-height {
  height: 200px;
}
</style>
