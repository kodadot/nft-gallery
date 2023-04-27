<template>
  <div>
    <NeoCollapse :disabled="disabled">
      <div class="is-flex">
        {{ $t('massmint.overviewTable') }}
      </div>
      <template #content>
        <div class="limit-height">
          <div
            class="columns is-variable is-1 is-mobile m-0 px-4 py-1 border-bottom">
            <div class="column has-text-grey">#</div>
            <div class="column has-text-grey">{{ $t('massmint.image') }}</div>
            <div class="column has-text-grey">{{ $t('massmint.name') }}</div>
            <div class="column is-3 has-text-grey">
              {{ $t('massmint.description') }}
            </div>
            <div class="column has-text-grey">{{ $t('massmint.price') }}</div>
            <div class="column has-text-grey">{{ $t('massmint.status') }}</div>
            <div class="column has-text-grey">
              {{ $t('massmint.operation') }}
            </div>
          </div>
          <div
            v-for="nft in displayedNFTS"
            :key="nft.id"
            class="columns is-variable is-1 is-mobile border-bottom m-0 py-1 px-4">
            <div class="column is-flex is-align-items-center has-text-grey">
              {{ nft.id }}
            </div>
            <div class="column is-flex is-align-items-center">
              <img :src="nft.imageUrl" class="image is-48x48 border cover" />
            </div>
            <div class="column is-flex is-align-items-center">
              <div
                class="is-clickable"
                :class="{
                  'has-text-k-red': !nft.name,
                  'has-text-grey': nft.name,
                }"
                @click="openSideBarWith(nft)">
                {{ nft.name || '*' + $t('massmint.nameRequired') }}
              </div>
            </div>
            <div class="column is-3 is-flex is-align-items-center">
              <div
                class="is-clickable"
                :class="{
                  'has-text-k-red': !nft.description,
                  'clip-text has-text-grey': nft.description,
                }"
                @click="openSideBarWith(nft)">
                {{ nft.description || $t('massmint.descriptionMissing') }}
              </div>
            </div>
            <div class="column is-flex is-align-items-center">
              <div class="is-clickable" @click="openSideBarWith(nft)">
                <CommonTokenMoney
                  v-if="nft.price"
                  :value="nft.price * Math.pow(10, 12)"
                  class="has-text-grey" />
                <div v-else class="has-text-k-red">
                  {{ $t('massmint.priceMissing') }}
                </div>
              </div>
            </div>
            <div class="column is-flex is-align-items-center">
              <div class="height-50px is-flex is-align-items-center">
                <div
                  class="border is-size-7 is-justify-content-center py-1 my-2 is-flex is-align-items-center fixed-width"
                  :class="statusClass(nft.status)">
                  {{ statusTranslation(nft.status) }}
                </div>
              </div>
            </div>
            <div class="column is-flex is-align-items-center has-text-grey">
              <NeoButton
                icon="edit"
                class="has-text-grey"
                variant="icon"
                no-shadow
                @click.native="openSideBarWith(nft)" />

              <NeoButton
                icon="trash"
                class="has-text-grey ml-3"
                variant="icon"
                no-shadow
                @click.native="deleteNFT(nft)" />
            </div>
          </div>
          <div ref="sentinel" />
        </div>
      </template>
    </NeoCollapse>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoCollapse } from '@kodadot1/brick'
import { useIntersectionObserver } from '@vueuse/core'
import { NFT, NFTS, Status } from './types'
import { statusClass, statusTranslation } from './useMassMint'
const offset = ref(10)
const sentinel = ref<HTMLDivElement | null>(null)
const emit = defineEmits(['openSideBarWith', 'delete'])

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

const displayedNFTS = computed<NFT[]>(() =>
  Object.values(props.nfts).slice(0, offset.value).map(addStatus)
)

const openSideBarWith = (nft: NFT) => {
  emit('openSideBarWith', nft)
}

const deleteNFT = (nft: NFT) => {
  emit('delete', nft)
}

const addStatus = (nft: NFT): NFT => {
  let status: Status = Status.Ok
  if (!nft.description) {
    status = Status.Description
  }
  if (!nft.name) {
    status = Status.Incomplete
  }
  return {
    ...nft,
    status,
  }
}

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  const target = entries[0]
  if (target.isIntersecting) {
    offset.value += 10
  }
}
useIntersectionObserver(sentinel, handleIntersection, { threshold: 0.66 })
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.border-bottom {
  @include ktheme() {
    border-color: theme('k-shade');
  }
}

.cover {
  object-fit: cover;
}

.limit-height {
  max-height: 30rem;
  overflow-y: auto;
}

.fixed-width {
  width: 80px;
}

.height-50px {
  height: 50px;
}

.clip-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 90%;
}
</style>
