<template>
  <div v-if="collection" class="is-flex is-align-items-center">
    <NeoIcon
      :icon="isHolder ? 'circle-check' : 'lock-keyhole'"
      icon-pack="fas"
      :class="[
        'mr-3',
        {
          'has-text-success': isHolder,
          'has-text-grey': !isHolder,
        },
      ]" />
    <NuxtImg
      height="32"
      densities="2x"
      :src="sanitizeIpfsUrl(collection?.meta?.image)"
      alt="avatar"
      class="object-fit-cove mr-3 border" />
    <div>
      <div class="is-size-7 has-text-grey">Exclusive to NFT owners of</div>
      <div class="is-size-6">
        <nuxt-link :to="`/${urlPrefix}/collection/${collectionId}`">
          {{ collection?.name }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { NeoIcon } from '@kodadot1/brick'

const props = defineProps({
  isHolder: {
    type: Boolean,
    default: false,
  },
  collectionId: {
    type: String,
    default: '',
  },
})

const { urlPrefix } = usePrefix()

const { collection } = useCollectionMinimal({
  collectionId: computed(() => props.collectionId),
})
</script>
