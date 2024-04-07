<template>
  <div
    class="bg-neutral-3 dark:bg-neutral-11 py-12 flex justify-center border-t">
    <div
      class="!py-10 !px-14 max-w-[740px] bg-background-color border rounded-xl shadow-primary">
      <p class="text-3xl md:text-4xl font-bold capitalize">
        {{ $t('whyKoda.cta.heading') }}
      </p>
      <p class="!mt-5 max-w-[510px]">{{ $t('whyKoda.cta.description') }}</p>

      <NeoButton
        :tag="NuxtLink"
        to="https://t.me/just_luuuu"
        target="_blank"
        no-shadow
        icon-left="arrow-right"
        variant="k-accent"
        class="!mt-10">
        {{ $t('whyKoda.cta.getInTouch') }}
      </NeoButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
const NuxtLink = resolveComponent('NuxtLink')
</script>
