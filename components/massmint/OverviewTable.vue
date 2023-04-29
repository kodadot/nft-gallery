<template>
  <div>
    <NeoCollapse :disabled="disabled">
      <div class="is-flex">
        {{ $t('massmint.overviewTable') }}
      </div>
      <template #content>
        <div class="limit-height">
          <div
            class="columns is-variable is-1 is-mobile m-0 px-4 py-1 border-bottom border-k-grey">
            <div class="column has-text-grey is-1">#</div>
            <div class="column has-text-grey">{{ $t('massmint.image') }}</div>
            <div class="column has-text-grey">{{ $t('massmint.name') }}</div>
            <div class="column is-3 has-text-grey">
              {{ $t('massmint.description') }}
            </div>
            <div class="column has-text-grey">{{ $t('massmint.price') }}</div>
            <div class="column has-text-grey is-flex is-justify-content-center">
              <span class="pl-2">{{ $t('massmint.status') }}</span>
            </div>
            <div class="column has-text-grey is-flex is-justify-content-center">
              {{ $t('massmint.operation') }}
            </div>
          </div>
          <div
            v-for="nft in displayedNFTS"
            :key="nft.id"
            class="columns is-variable is-1 is-mobile border-bottom border-k-shade m-0 py-1 px-4">
            <div class="column is-flex is-align-items-center is-1">
              {{ nft.id }}
            </div>
            <div class="column is-flex is-align-items-center">
              <NeoAvatar
                :avatar="nft.imageUrl"
                :name="nft.name || `${nft.id}`"
                :size="48"
                :placeholder="placeholder" />
            </div>
            <div class="column is-flex is-align-items-center">
              <div
                class="is-clickable"
                :class="{
                  'has-text-k-red': !nft.name,
                }"
                @click="openSideBarWith(nft)">
                {{ nft.name || '*' + $t('massmint.nameRequired') }}
              </div>
            </div>
            <div class="column is-3 is-flex is-align-items-center">
              <div
                class="is-clickable clip-text"
                :class="{
                  'has-text-k-orange': !nft.description,
                }"
                @click="openSideBarWith(nft)">
                {{ nft.description || $t('massmint.descriptionMissing') }}
              </div>
            </div>
            <div class="column is-flex is-align-items-center">
              <div class="is-clickable" @click="openSideBarWith(nft)">
                <CommonTokenMoney
                  v-if="nft.price"
                  :value="nft.price * Math.pow(10, 12)" />
                <div v-else class="has-text-k-orange">
                  {{ $t('massmint.priceMissing') }}
                </div>
              </div>
            </div>
            <div class="column is-flex is-align-items-center">
              <div class="is-flex is-align-items-center pl-2">
                <div
                  class="border is-size-7 is-justify-content-center py-2 is-flex is-align-items-center fixed-width"
                  :class="statusClass(nft.status)">
                  {{ statusTranslation(nft.status) }}
                </div>
              </div>
            </div>
            <div
              class="column is-flex is-align-items-center is-justify-content-center">
              <NeoButton
                icon="edit"
                size="large"
                variant="icon"
                no-shadow
                @click.native="openSideBarWith(nft)" />

              <NeoButton
                icon="trash"
                size="large"
                class="ml-3"
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
import { NeoAvatar, NeoButton, NeoCollapse } from '@kodadot1/brick'
import { useIntersectionObserver } from '@vueuse/core'
import { NFT, NFTS, Status } from './types'
import { statusClass, statusTranslation } from './useMassMint'
const { placeholder } = useTheme()

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
  const getStatus = (nft: NFT): Status => {
    if (!nft.name) {
      return Status.Incomplete
    }
    if (!nft.description && !nft.price) {
      return Status.Optional
    }
    if (!nft.description) {
      return Status.Description
    }
    if (!nft.price) {
      return Status.Price
    }
    return Status.Ok
  }

  return {
    ...nft,
    status: getStatus(nft),
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

.border-k-grey {
  @include ktheme() {
    border-color: theme('k-grey');
  }
}
.border-k-shade {
  @include ktheme() {
    border-color: theme('k-shade');
  }
}

.limit-height {
  max-height: 30rem;
  overflow-y: auto;
}

.fixed-width {
  width: 100px;
}

.clip-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 90%;
}
</style>
