<template>
  <div class="p-6">
    <NeoButton
      icon-left="arrow-left"
      rounded
      variant="outlined-rounded"
      @click="$router.back()">
      {{ $t('go back') }}</NeoButton
    >
    <div class="min-h-screen flex flex-col items-center">
      <div class="w-full max-w-lg">
        <h1 class="text-3xl font-bold mb-4">
          {{ $t('createPlaceholder.welcome') }}
        </h1>
        <hr class="border-t-2 border-gray-400 my-6" />
        <p class="mb-4">
          {{ $t('createPlaceholder.desc') }}
        </p>
        <p class="mb-4">
          {{ $t('createPlaceholder.launchOwn') }}
          <a
            href="https://form.kodadot.xyz/drop-interest"
            class="text-blue-500 underline">
            {{ $t('createPlaceholder.fill') }}</a
          >
          {{ $t('createPlaceholder.learnMore') }}
        </p>
        <p class="">
          {{ $t('createPlaceholder.codeStruct') }}
          <a
            href="https://hello.kodadot.xyz/generative/generative-art"
            class="text-blue-500 underline">
            {{ $t('createPlaceholder.documentation') }}</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
</script>
