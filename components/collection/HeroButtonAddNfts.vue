<template>
  <NeoDropdownItem @click="addNfts">
    {{ $i18n.t('moreActions.addNfts') }}
  </NeoDropdownItem>
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'

const route = useRoute()
const { $i18n } = useNuxtApp()

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
