<template>
  <section class="flex max-md:flex-col-reverse max-md:flex-col border-b">
    <div class="w-full md:w-1/2 flex justify-end max-md:border-t md:border-r">
      <div class="p-[96px]">
        <h1 class="flex items-center gap-6">
          <span
            class="text-3xl md:text-6xl font-bold text-center capitalize md:inline">
            Why
          </span>
          <img src="~/public/Koda_logo.svg" alt="koda-logo" />
        </h1>

        <p class="!mt-6 text-xl">
          {{ $t('whyKoda.embraceTheFutureOfGenerativeArt') }}
        </p>

        <div class="mt-16">
          <ol class="list-decimal text-lg pl-5">
            <li v-for="section in sections" :key="section.id">
              <NeoButton
                variant="text"
                tag="a"
                no-shadow
                class="text-lg"
                :href="`#${section.id}`">
                {{ section.name }}
              </NeoButton>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div class="w-full md:w-1/2 flex justify-end max-md:h-20">
      <div calss="flex gap-4"></div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

defineProps<{
  sections: { name: string; id: string }[]
}>()
</script>
