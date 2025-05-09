<template>
  <div class="flex flex-col gap-6">
    <NeoSkeleton
      :width="330"
      :height="36"
      no-margin
    />

    <div class="flex flex-wrap gap-3">
      <NeoSkeleton
        :width="110"
        :height="40"
        no-margin
        border-radius="3rem"
        class="w-fit!"
      />
      <NeoSkeleton
        :width="200"
        :height="40"
        no-margin
        border-radius="3rem"
        class="w-fit!"
      />
      <NeoSkeleton
        :width="60"
        :height="40"
        no-margin
        border-radius="3rem"
        class="w-fit!"
      />
    </div>

    <NeoSkeleton
      :width="400"
      :height="20"
      no-margin
      class="max-sm:hidden!"
    />
    <NeoSkeleton
      :width="200"
      :height="20"
      no-margin
      class="md:hidden!"
    />
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
</script>
