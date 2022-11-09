<template>
  <Story title="Media Object">
    <Variant title="default">
      <MediaObject />
    </Variant>

    <Variant title="image">
      <MediaObject
        src="https://kodadot.mypinata.cloud/ipfs/bafybeig6clbsbabxkku3m4furbj4klayyx7ovwtcocmgwqmv4nxllnbxxy" />
    </Variant>

    <Variant title="video">
      <MediaObject
        src="https://kodadot.mypinata.cloud/ipfs/bafybeib22hxgpef7lpoltxsi2p2bm7jjhnntwedeupdjcz4pxgfps6dz7i"
        animation-src="https://kodadot.mypinata.cloud/ipfs/bafybeigy4tyylo7hvk5qovlqwahl5dnh56wzdt3rrawceyqrlmvmbw7sey"
        mime-type="video/mp4" />
    </Variant>

    <Variant title="audio">
      <MediaObject
        src="https://kodadot.mypinata.cloud/ipfs/bafybeig6dnjacg4sipst4tkxm36ykkfuqkkb5dvfaale4u65hjtdlspvri"
        animation-src="https://kodadot.mypinata.cloud/ipfs/bafybeibuet6ba3xquuhiurq2on2i5ccibuh3s7aiqp6c2gqlokgtgwvu5y"
        mime-type="audio/mpeg" />
    </Variant>

    <Variant title="3d">
      <MediaObject
        animation-src="https://kodadot.mypinata.cloud/ipfs/bafybeiemgzrougue4cwbf3g5ejnmrjrjxdy45522zecz6eukcpwg42z2g4"
        mime-type="model/gltf-binary" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import MediaObject from './MediaObject.vue'
</script>
