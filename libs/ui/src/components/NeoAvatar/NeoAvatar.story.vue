<template>
  <Story title="NeoAvatar">
    <Variant title="Nft Avatar">
      <NeoAvatar {...avatar} />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoAvatar from './NeoAvatar.vue'

const avatar = {
  avatar:
    'https://kodadot.mypinata.cloud/ipfs/bafybeigdh3ecetqmzplrjrovs5po23vwpikh2vgtfjai4vky5qzitjzaq4',
  placeholder:
    'https://kodadot.mypinata.cloud/ipfs/bafybeigdh3ecetqmzplrjrovs5po23vwpikh2vgtfjai4vky5qzitjzaq4',
  name: 'NFT Avatar',
  size: 70,
}
</script>
