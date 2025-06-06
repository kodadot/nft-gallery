<template>
  <div>
    <NeoCollapsible :disabled="disabled">
      <div class="flex">
        {{ $t('massmint.overviewTable') }}
      </div>
      <template #content>
        <div class="max-h-[30rem] overflow-y-auto">
          <table class="table-auto">
            <thead>
              <tr>
                <th>#</th>
                <th>{{ $t('massmint.image') }}</th>
                <th>{{ $t('massmint.name') }}</th>
                <th>{{ $t('massmint.description') }}</th>
                <th> {{ $t('nft.properties.label') }}</th>
                <th>{{ $t('massmint.price') }}</th>
                <th><span class="pl-2">{{ $t('massmint.status') }}</span></th>
                <th>{{ $t('massmint.operation') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="nft in displayedNFTS"
                :key="nft.id"
                class="border-b border-k-shade m-0 py-1 px-4"
              >
                <td class="align-middle!">
                  {{ nft.id }}
                </td>
                <td class="align-middle!">
                  <NeoAvatar
                    :image-component="NuxtImg"
                    class="overflow-hidden m-0"
                    :avatar="nft.imageUrl"
                    :name="nft.name || `${nft.id}`"
                    :size="48"
                    :placeholder="placeholder"
                  />
                </td>
                <td class="align-middle!">
                  <div
                    class="cursor-pointer"
                    :class="{ 'text-k-red': !nft.name }"
                    @click="openSideBarWith(nft)"
                  >
                    {{ nft.name || '*' + $t('massmint.nameRequired') }}
                  </div>
                </td>
                <td class="align-middle!">
                  <div
                    class="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap max-w-[90%]"
                    :class="{ 'text-k-orange': !nft.description }"
                    @click="openSideBarWith(nft)"
                  >
                    {{ nft.description || $t('massmint.descriptionMissing') }}
                  </div>
                </td>
                <td class="align-middle!">
                  <div
                    class="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                    :class="{
                      'text-k-orange': !nft.attributes?.length,
                    }"
                    @click="openSideBarWith(nft)"
                  >
                    <div v-if="nft.attributes?.length">
                      <div
                        v-for="attr in nft.attributes"
                        :key="attr.trait_type"
                        class="flex items-center gap-2"
                      >
                        <span>{{ attr.trait_type }}: <span class="font-bold">{{ attr.value }}</span></span>
                        <span class="text-k-blue">{{ getAttributeRarity(attr.trait_type, attr.value) }}%</span>
                      </div>
                    </div>
                    <div v-else>
                      {{ $t('massmint.attributesMissing') }}
                    </div>
                  </div>
                </td>
                <td class="align-middle!">
                  <div
                    class="cursor-pointer"
                    @click="openSideBarWith(nft)"
                  >
                    <CommonTokenMoney
                      v-if="nft.price"
                      :value="getNativeNftPrice(nft)"
                    />
                    <div
                      v-else
                      class="text-k-orange"
                    >
                      {{ $t('massmint.priceMissing') }}
                    </div>
                  </div>
                </td>
                <td class="align-middle!">
                  <div class="flex items-center pl-2">
                    <div
                      class="border text-xs justify-center py-2 flex items-center w-[100px]"
                      :class="statusClass(nft.status)"
                    >
                      {{ statusTranslation(nft.status) }}
                    </div>
                  </div>
                </td>
                <td class="align-middle!">
                  <NeoButton
                    icon="edit"
                    size="large"
                    variant="icon"
                    no-shadow
                    @click="openSideBarWith(nft)"
                  />

                  <NeoButton
                    icon="trash"
                    size="large"
                    class="ml-3"
                    variant="icon"
                    no-shadow
                    @click="deleteNFT(nft)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div ref="sentinel" />
        </div>
      </template>
    </NeoCollapsible>
  </div>
</template>

<script setup lang="ts">
import { NeoAvatar, NeoButton, NeoCollapsible } from '@kodadot1/brick'
import { useIntersectionObserver } from '@vueuse/core'
import type { NFT, NFTS } from './types'
import { Status } from './types'
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
    collectionId?: string
  }>(),
  {
    disabled: false,
    nfts: () => ({}),
    collectionId: undefined,
  },
)

const { getAttributeRarity } = useCollectionAttributes({
  collectionId: computed(() => props.collectionId),
  extraNfts: computed(() => Object.values(props.nfts)),
})

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
