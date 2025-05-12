<template>
  <div class="border border-card-border-color bg-background-color h-min">
    <div class="aspect-square">
      <NeoSkeleton
        no-margin
        :rounded="false"
        height="100%"
        class="h-full"
      />
    </div>

    <div
      class="min-h-[115px] py-5 px-2 sm:px-5! flex flex-col justify-between gap-4"
    >
      <div class="flex justify-between min-h-[60px]">
        <div class="flex flex-col gap-2">
          <div class="w-40">
            <NeoSkeleton
              no-margin
              class="w-full"
              :rounded="false"
              height="28"
            />
          </div>
          <div class="w-32 h-6! flex gap-2">
            <div class="w-[22px] shrink-0">
              <NeoSkeleton
                no-margin
                class="w-full"
                circle
                height="24"
                width="24"
              />
            </div>

            <div class="w-full">
              <NeoSkeleton
                no-margin
                class="w-full"
                height="24"
                :rounded="false"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="w-[58px] relative">
            <NeoSkeleton
              no-margin
              class="w-full"
              border-radius="5rem"
              full-size
              height="22"
            />
          </div>
        </div>
      </div>

      <div
        class="flex justify-between items-center flex-wrap gap-y-4 gap-x-2 w-full"
      >
        <div class="w-32 flex gap-2">
          <NeoSkeleton
            height="28"
            width="100%"
            :rounded="false"
            no-margin
          />
          <NeoSkeleton
            height="28"
            width="100%"
            :rounded="false"
            no-margin
          />
        </div>

        <div class="flex flex-row gap-4 w-28">
          <NeoSkeleton
            height="28"
            width="100%"
            :rounded="false"
            no-margin
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>
