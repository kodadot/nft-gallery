<template>
  <NeoDropdownItem @click="addNfts">
    {{ $t('moreActions.addNfts') }}
  </NeoDropdownItem>
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'

const route = useRoute()

const id = route.params.id.toString()

const addNfts = () => {
  navigateTo({
    path: '/create/nft',
    query: {
      collectionId: id,
    },
  })
}
</script>
