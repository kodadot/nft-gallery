<template>
  <div class="w-full h-[50px]">
    <div class="flex justify-between">
      <div class="flex">
        <div>
          <NeoSkeleton
            no-margin
            height="48px"
            width="48px"
            :rounded="false"
          />
        </div>

        <div class="flex flex-col justify-between ml-4 w-[100px] md:w-[170px]">
          <NeoSkeleton
            no-margin
            :rounded="false"
            width="130px"
          />

          <NeoSkeleton
            no-margin
            :rounded="false"
            width="90px"
          />
        </div>
      </div>

      <div class="flex items-end">
        <NeoSkeleton
          no-margin
          :rounded="false"
          width="60px"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>
