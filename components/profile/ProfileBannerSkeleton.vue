<template>
  <div class="relative !h-[360px] border-b">
    <NeoSkeleton
      class="h-full absolute"
      item-class="!h-full w-full m-0"
      no-margin />

    <div
      class="collection-banner-content flex items-end h-full pb-7 max-sm:mx-5 mx-12 2xl:mx-auto max-w-[89rem]">
      <div
        class="!rounded-full overflow-hidden p-2.5 bg-background-color border z-[10]">
        <NeoSkeleton
          item-class="!h-[124px] !w-[124px] !rounded-full m-0"
          no-margin />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
</script>
