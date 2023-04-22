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
            <div class="column">{{ $t('massmint.image') }}</div>
            <div class="column">{{ $t('massmint.name') }}</div>
            <div class="column is-3">{{ $t('massmint.description') }}</div>
            <div class="column">{{ $t('massmint.price') }}</div>
            <div class="column">{{ $t('massmint.status') }}</div>
            <div class="column">{{ $t('massmint.operation') }}</div>
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
                  {{ nft.status }}
                </div>
              </div>
            </div>
            <div class="column is-flex is-align-items-center">
              <NeoIcon
                class="is-clickable"
                icon="edit"
                @click.native="openSideBarWith(nft)" />
              <NeoIcon
                class="is-clickable ml-3"
                icon="trash"
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
import { NeoCollapse, NeoIcon } from '@kodadot1/brick'
import { useIntersectionObserver } from '@vueuse/core'
import { NFT, NFTS, Status } from './types'

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

const statusClass = (status?: Status) => {
  const statusMap: { [status: string]: string } = {
    Ok: 'k-green',
    Incomplete: 'k-red',
    Description: 'k-yellow',
  }

  return status ? statusMap[status] : ''
}

const addStatus = (nft: NFT): NFT => {
  let status: Status = 'Ok'
  if (!nft.description) {
    status = 'Description'
  }
  if (!nft.name) {
    status = 'Incomplete'
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

//colums overrides
.column {
  padding: 0;
  padding-right: 0.25rem;
}

.clip-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 90%;
}
</style>
