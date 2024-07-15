<template>
  <div class="relative md:!h-[360px] !h-40 border-b">
    <NeoSkeleton
      class="h-full absolute"
      item-class="!h-full w-full m-0"
      no-margin />

    <div
      class="collection-banner-content flex md:items-end items-center h-full md:pb-10 max-sm:mx-5 mx-12 2xl:mx-auto max-w-[89rem]">
      <div
        class="!rounded-full overflow-hidden p-2.5 bg-background-color border z-[10]">
        <NeoSkeleton
          item-class="md:!w-[124px] md:!h-[124px] !h-[78px] !w-[78px] !rounded-full m-0"
          no-margin />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
</script>
