<template>
  <NeoDropdownItem @click="addNfts">
    {{ $t('moreActions.addNfts') }}
  </NeoDropdownItem>
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'

const addNfts = () => {
  navigateTo({
    path: '/create',
  })
}
</script>
