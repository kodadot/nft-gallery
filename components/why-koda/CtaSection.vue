<template>
  <div class="bg-neutral-3 dark:bg-neutral-11 py-12 border-t w-full">
    <div class="container mx-auto max-md:px-4 flex justify-center">
      <div
        class="!px-8 !py-10 md:!px-14 max-w-[740px] bg-background-color border rounded-xl shadow-primary">
        <p class="text-3xl md:text-5xl font-bold capitalize">
          {{ $t('whyKoda.cta.heading') }}
        </p>
        <p class="!mt-5 max-w-[510px] text-xl">
          {{ $t('whyKoda.cta.description') }}
        </p>

        <NeoButton
          tag="a"
          href="https://t.me/just_luuuu"
          target="_blank"
          no-shadow
          icon-left="arrow-right"
          variant="k-accent"
          class="!mt-10">
          {{ $t('whyKoda.cta.getInTouch') }}
        </NeoButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
</script>
