<template>
  <div v-if="relatedDrop" class="flex w-full justify-center mt-4">
    <div
      class="rounded-full border justify-between items-center px-4 bg-background-color flex">
      <div class="flex items-center">
        <span class="relative flex h-3 w-3 mr-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-k-primary opacity-75"></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-k-primary"></span>
        </span>
        <span> {{ $t('drops.mintingLive') }} </span>
      </div>
      <div class="w-4 h-[1px] bg-separator-line-color mx-2" />
      <nuxt-link
        class="flex items-center font-bold my-2"
        :to="`/${relatedDrop.chain}/drops/${relatedDrop.alias}`">
        {{ $t('drops.viewDrop') }}
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRelatedActiveDrop } from '@/components/drops/useDrops'

const props = defineProps<{
  collectionId: string
}>()

const collectionId = computed(() => props.collectionId)
const { urlPrefix } = usePrefix()
const relatedDrop = useRelatedActiveDrop(collectionId.value, urlPrefix.value)
</script>
