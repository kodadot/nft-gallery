<template>
  <NeoDropdownItem @click="addNfts">
    {{ $t('moreActions.addNfts') }}
  </NeoDropdownItem>
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'

const route = useRoute()

const id = route.params.id.toString()
const { urlPrefix } = usePrefix()

const addNfts = () => {
  navigateTo({
    path: `/${urlPrefix.value}/create`,
    query: {
      select: 'nft',
      collectionId: id,
    },
  })
}
</script>
