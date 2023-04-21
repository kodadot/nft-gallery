<template>
  <div>
    <NeoCollapse :disabled="disabled">
      <div class="is-flex">
        {{ $t('massmint.overviewTable') }}
      </div>
      <template #content>
        <div class="limit-height">
          <div class="columns m-0 px-4 py-3 border-bottom">
            <div class="column">#</div>
            <div class="column">Image</div>
            <div class="column">Name</div>
            <div class="column">Description</div>
            <div class="column">Price</div>
            <div class="column">Status</div>
            <div class="column">Operation</div>
          </div>
          <div
            v-for="nft in displayedNFTS"
            :key="nft.id"
            class="columns border-bottom m-0 py-2 px-4">
            <div class="column is-flex is-align-items-center">
              {{ nft.id }}
            </div>
            <div class="column is-flex is-align-items-center">
              <img :src="nft.imageUrl" class="image is-48x48 border" />
            </div>
            <div class="column is-flex is-align-items-center">
              <div
                :class="{ 'has-text-k-red': !nft.name }"
                @click="openSideBarWith(nft)">
                {{ nft.name || '* Name Required' }}
              </div>
            </div>
            <div class="column is-flex is-align-items-center">
              {{ nft.description || 'description' }}
            </div>
            <div class="column is-flex is-align-items-center">
              {{ nft.price || 0 }}
            </div>
            <div class="column is-flex is-align-items-center">
              <div class="height-50px is-flex is-align-items-center">
                <div
                  class="border is-size-7 is-justify-content-center py-1 my-2 is-flex is-align-items-center fixed-width fixed-height"
                  :class="statusClass(nft.status)">
                  {{ nft.status }}
                </div>
              </div>
            </div>
            <div class="column is-flex is-align-items-center">Operation</div>
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
import { NFT, NFTS, Status } from './types'

const offset = ref(10)
const sentinel = ref<HTMLDivElement | null>(null)
const emit = defineEmits(['openSideBarWith'])

const openSideBarWith = (nft: NFT) => {
  emit('openSideBarWith', nft)
}

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    nfts?: NFTS
  }>(),
  {
    disabled: false,
    nfts: undefined,
  }
)

const statusClass = (status?: Status) => {
  const statusMap: { [status: string]: string } = {
    Ok: 'has-background-success',
    Incomplete: 'has-background-warning',
    Description: 'has-background-danger	',
  }

  return status ? statusMap[status] : ''
}

const addStatus = (nft: NFT): NFT => {
  let status: Status = 'Ok'
  if (!nft.description) {
    status = 'Description'
  }
  if (!nft.name || !nft.price) {
    status = 'Incomplete'
  }
  return {
    ...nft,
    status,
  }
}
const displayedNFTS = computed<NFT[]>(() =>
  Object.values(props.nfts).slice(0, offset.value).map(addStatus)
)

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  const target = entries[0]
  if (target.isIntersecting) {
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

.fixed-width {
  width: 80px;
}

.fixed-height {
  height: 22px;
}

.height-50px {
  height: 50px;
}

//colums overrides
.column {
  padding: 0;
}
</style>
