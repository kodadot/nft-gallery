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
        animation-src="https://kodadot.mypinata.cloud/ipfs/bafybeiemgzrougue4cwbf3g5ejnmrjrjxdy45522zecz6eukcpwg42z2g4" />
    </Variant>

    <Variant title="json">
      <MediaObject
        src="https://kodadot.mypinata.cloud/ipfs/bafkreiatmzjr4tx46tyjh63bpyici6sb54cllvuozj2t2ct2vbx4ez4puy"
        mime-type="application/json" />
    </Variant>

    <!-- cors origin -->
    <!-- <Variant title="iframe">
      <MediaObject src="https://kodadot.xyz/" mime-type="text/html" />
    </Variant> -->

    <Variant title="pdf">
      <MediaObject
        src="https://kodadot.mypinata.cloud/ipfs/bafybeih6yrucucyamosb2nk4qch4cg4bxdv3yheortwawttslvt7ameiiu"
        mime-type="application/pdf" />
    </Variant>

    <Variant title="unknown">
      <MediaObject
        src="https://kodadot.mypinata.cloud/ipfs/bafybeih6yrucucyamosb2nk4qch4cg4bxdv3yheortwawttslvt7ameiiu"
        mime-type="unknown" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import MediaObject from './MediaObject.vue'
</script>
