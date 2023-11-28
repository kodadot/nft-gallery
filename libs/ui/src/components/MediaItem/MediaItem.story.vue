<template>
  <Story title="MediaItem">
    <Variant title="image">
      <ImageMedia
        src="https://image-beta.w.kodadot.xyz/ipfs/bafybeig6clbsbabxkku3m4furbj4klayyx7ovwtcocmgwqmv4nxllnbxxy" />
    </Variant>

    <Variant title="video">
      <VideoMedia
        src="https://image-beta.w.kodadot.xyz/ipfs/bafybeib22hxgpef7lpoltxsi2p2bm7jjhnntwedeupdjcz4pxgfps6dz7i"
        animation-src="https://image-beta.w.kodadot.xyz/ipfs/bafybeigy4tyylo7hvk5qovlqwahl5dnh56wzdt3rrawceyqrlmvmbw7sey"
        mime-type="video/mp4" />
    </Variant>

    <Variant title="audio">
      <NeoAudioPlayer
        src="https://image-beta.w.kodadot.xyz/ipfs/bafybeig6dnjacg4sipst4tkxm36ykkfuqkkb5dvfaale4u65hjtdlspvri"
        animation-src="https://image-beta.w.kodadot.xyz/ipfs/bafybeibuet6ba3xquuhiurq2on2i5ccibuh3s7aiqp6c2gqlokgtgwvu5y"
        mime-type="audio/mpeg" />
    </Variant>

    <Variant title="3d">
      <ModelMedia
        animation-src="https://image-beta.w.kodadot.xyz/ipfs/bafybeiemgzrougue4cwbf3g5ejnmrjrjxdy45522zecz6eukcpwg42z2g4" />
    </Variant>

    <Variant title="json">
      <JsonMedia
        src="https://image-beta.w.kodadot.xyz/ipfs/bafkreiatmzjr4tx46tyjh63bpyici6sb54cllvuozj2t2ct2vbx4ez4puy"
        mime-type="application/json" />
    </Variant>

    <Variant title="pdf">
      <ObjectMedia
        src="https://image-beta.w.kodadot.xyz/ipfs/bafybeih6yrucucyamosb2nk4qch4cg4bxdv3yheortwawttslvt7ameiiu"
        mime-type="application/pdf" />
    </Variant>

    <Variant title="unknown">
      <UnknownMedia
        src="https://image-beta.w.kodadot.xyz/ipfs/bafybeih6yrucucyamosb2nk4qch4cg4bxdv3yheortwawttslvt7ameiiu"
        mime-type="unknown" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { NeoAudioPlayer } from '@kodadot1/brick'

import ImageMedia from './type/ImageMedia.vue'
import VideoMedia from './type/VideoMedia.vue'
import JsonMedia from './type/JsonMedia.vue'
import ModelMedia from './type/ModelMedia.vue'
import ObjectMedia from './type/ObjectMedia.vue'
import UnknownMedia from './type/UnknownMedia.vue'
</script>
