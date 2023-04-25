<template>
  <Story title="NeoAvatar">
    <Variant title="Nft Avatar">
      <NeoAvatar
        :avatar="image"
        :placeholder="image"
        :name="name"
        :size="size" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoAvatar from './NeoAvatar.vue'

const image =
  'https://kodadot.mypinata.cloud/ipfs/bafybeigdh3ecetqmzplrjrovs5po23vwpikh2vgtfjai4vky5qzitjzaq4'

const name = 'NFT Avatar'
const size = 70
</script>
