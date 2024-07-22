<template>
  <div>
    <NeoCollapsible :disabled="disabled">
      <div class="flex">
        {{ $t('massmint.overviewTable') }}
      </div>
      <template #content>
        <div class="max-h-[30rem] overflow-y-auto">
          <div
            class="columns is-variable is-1 is-mobile m-0 px-4 py-1 border-b border-k-grey">
            <div class="column text-k-grey is-1">#</div>
            <div class="column text-k-grey">{{ $t('massmint.image') }}</div>
            <div class="column text-k-grey">{{ $t('massmint.name') }}</div>
            <div class="column is-3 text-k-grey">
              {{ $t('massmint.description') }}
            </div>
            <div class="column text-k-grey">{{ $t('massmint.price') }}</div>
            <div class="column text-k-grey flex justify-center">
              <span class="pl-2">{{ $t('massmint.status') }}</span>
            </div>
            <div class="column text-k-grey flex justify-center">
              {{ $t('massmint.operation') }}
            </div>
          </div>
          <div
            v-for="nft in displayedNFTS"
            :key="nft.id"
            class="columns is-variable is-1 is-mobile border-b border-k-shade m-0 py-1 px-4">
            <div class="column flex items-center is-1">
              {{ nft.id }}
            </div>
            <div class="column flex items-center">
              <NeoAvatar
                :image-component="NuxtImg"
                :avatar="nft.imageUrl"
                :name="nft.name || `${nft.id}`"
                :size="48"
                :placeholder="placeholder" />
            </div>
            <div class="column flex items-center">
              <div
                class="cursor-pointer"
                :class="{
                  'text-k-red': !nft.name,
                }"
                @click="openSideBarWith(nft)">
                {{ nft.name || '*' + $t('massmint.nameRequired') }}
              </div>
            </div>
            <div class="column is-3 flex items-center">
              <div
                class="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap max-w-[90%]"
                :class="{
                  'text-k-orange': !nft.description,
                }"
                @click="openSideBarWith(nft)">
                {{ nft.description || $t('massmint.descriptionMissing') }}
              </div>
            </div>
            <div class="column flex items-center">
              <div class="cursor-pointer" @click="openSideBarWith(nft)">
                <CommonTokenMoney
                  v-if="nft.price"
                  :value="getNativeNftPrice(nft)" />
                <div v-else class="text-k-orange">
                  {{ $t('massmint.priceMissing') }}
                </div>
              </div>
            </div>
            <div class="column flex items-center">
              <div class="flex items-center pl-2">
                <div
                  class="border text-xs justify-center py-2 flex items-center w-[100px]"
                  :class="statusClass(nft.status)">
                  {{ statusTranslation(nft.status) }}
                </div>
              </div>
            </div>
            <div class="column flex items-center justify-center">
              <NeoButton
                icon="edit"
                size="large"
                variant="icon"
                no-shadow
                @click="openSideBarWith(nft)" />

              <NeoButton
                icon="trash"
                size="large"
                class="ml-3"
                variant="icon"
                no-shadow
                @click="deleteNFT(nft)" />
            </div>
          </div>
          <div ref="sentinel" />
        </div>
      </template>
    </NeoCollapsible>
  </div>
</template>

<script setup lang="ts">
import { NeoAvatar, NeoButton, NeoCollapsible } from '@kodadot1/brick'
import { useIntersectionObserver } from '@vueuse/core'
import { NFT, NFTS, Status } from './types'
import {
  statusClass,
  statusTranslation,
} from '@/composables/massmint/useMassMint'

const NuxtImg = resolveComponent('NuxtImg')

const { placeholder } = useTheme()
const { decimals } = useChain()

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
  },
)

const displayedNFTS = computed<NFT[]>(() =>
  Object.values(props.nfts).slice(0, offset.value).map(addStatus),
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

const getNativeNftPrice = (nft: NFT): string =>
  String((nft?.price || 0) * Math.pow(10, decimals.value))

useIntersectionObserver(sentinel, handleIntersection, { threshold: 0.66 })
</script>
