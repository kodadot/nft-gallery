<template>
  <DropsBasicDropCard
    :loading="!(drop.collection && !isLoadingMeta)"
    :card-is="externalUrl ? 'a' : NuxtLink"
    :to="!emitOnClick ? to : undefined"
    :name="drop.name"
    :image="sanitizeIpfsUrl(image)"
    :show-time-tag="Boolean(drop.dropStartTime || ended)"
    :owner-addresses="ownerAddresses"
    :drop-creator="drop.creator"
    :drop-start-time="drop.dropStartTime"
    :drop-status="drop.status"
    :drop-max="drop.max"
    :drop-prefix="drop.chain"
    :drop-price="drop.price"
    :minted="drop.minted"
    @click="click"
  />
</template>

<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { Prefix } from '@kodadot1/static'
import { DropStatus } from './useDrops'
import { useCollectionActivity } from '@/composables/collectionActivity/useCollectionActivity'
import type { DropItem } from '@/params/types'

const NuxtLink = resolveComponent('NuxtLink')

const emit = defineEmits(['click'])
const props = defineProps<{
  drop: DropItem
  dropUrl?: string
  emitOnClick?: boolean
}>()

const isLoadingMeta = ref(false)
const image = ref('')
const externalUrl = ref()

const dropPrefix = computed(() => props.drop.chain as Prefix)
const ended = computed(() => props.drop.status === DropStatus.MINTING_ENDED)
const to = computed(() => `/${dropPrefix.value}/drops/${props.drop.alias}`)

// TODO: get owners from oda workers. this query is quite heavy so many javascript calls on the client side
const { owners } = useCollectionActivity({
  collectionId: computed(() => props.drop?.collection),
  prefix: dropPrefix.value,
})
const ownerAddresses = computed(() => Object.keys(owners.value || {}))

const click = () => {
  emit('click', {
    path: to.value,
    drop: props.drop,
  })
}

onMounted(async () => {
  if (!props.drop?.collection) {
    return
  }

  image.value = props.drop.banner || props.drop.image
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';
.is-ellipsis {
  @include mobile {
    white-space: unset;
  }
}
</style>
