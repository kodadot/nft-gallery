<template>
  <div>
    <NeoCollapse :disabled="disabled">
      <div class="is-flex">
        {{ $t('massmint.overviewTable') }}
      </div>
      <template #content>
        <div class="p-3 limit-height">
          <div class="border-bottom">
            <div class="columns">
              <div class="column">#</div>
              <div class="column">Image</div>
              <div class="column">Name</div>
              <div class="column">Description</div>
              <div class="column">Price</div>
              <div class="column">Status</div>
              <div class="column">Operation</div>
            </div>
          </div>
          <div
            v-for="(nft, index) in displayedNFTS"
            :key="index"
            class="columns">
            <div class="column">{{ index + 1 }}</div>
            <div class="column">
              <img :src="nft.imageUrl" class="image is-48x48" />
            </div>
            <div class="column">{{ nft.name }}</div>
            <div class="column">{{ nft.description || 'description' }}</div>
            <div class="column">{{ nft.price || 0 }}</div>
            <div class="column">{{ nft.status }}</div>
            <div class="column">{{ $t('massmint.operation') }}</div>
          </div>
          <div ref="sentinel" />
        </div>
      </template>
    </NeoCollapse>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapse } from '@kodadot1/brick'
import { useIntersectionObserver } from '@vueuse/core'

export type NFT = {
  imageUrl: string
  name?: string
  description?: string
  price?: number
  status?: 'ok' | 'incomplete' | 'description'
}

export type NFTS = NFT[]

const offset = ref(10)
const displayedNFTS = ref<NFT[]>([])
const sentinel = ref<HTMLDivElement | null>(null)

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    nfts: NFTS
  }>(),
  {
    disabled: false,
  }
)

watch(
  offset,
  () => {
    displayedNFTS.value = props.nfts.slice(0, offset.value)
  },
  { immediate: true }
)

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  const target = entries[0]
  if (target.isIntersecting) {
    console.log('intersecting')
    offset.value += 10
  }
}
useIntersectionObserver(sentinel, handleIntersection, { threshold: 0.66 })
</script>

<style scoped lang="scss">
.limit-height {
  max-height: 30rem;
  overflow-y: auto;
}
</style>
