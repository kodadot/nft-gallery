<template>
  <div v-if="relatedActiveDrop" class="flex w-full justify-center mt-4">
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
        :to="`/${relatedActiveDrop.chain}/drops/${relatedActiveDrop.alias}`">
        {{ $t('drops.viewDrop') }}
      </nuxt-link>
    </div>
  </div>
  <div v-else-if="relatedEndedDrop" class="flex w-full justify-center mt-4">
    <NeoButton
      :tag="NuxtLink"
      :to="`/${relatedEndedDrop.chain}/drops/${relatedEndedDrop.alias}`"
      variant="secondary-rounded"
      icon-left="puzzle-piece"
      icon-pack="fal">
      {{ $t('drops.exploreDrop', [relatedEndedDrop.name]) }}
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import { useRelatedActiveDrop } from '@/components/drops/useDrops'
import { NeoButton } from '@kodadot1/brick'
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  collectionId: string
}>()

const collectionId = computed(() => props.collectionId)
const { urlPrefix } = usePrefix()
const { relatedActiveDrop, relatedEndedDrop } = useRelatedActiveDrop(
  collectionId.value,
  urlPrefix.value,
)
</script>
