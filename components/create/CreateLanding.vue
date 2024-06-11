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
          Welcome To KodaDot Generative Art!
        </h1>
        <hr class="border-t-2 border-gray-400 my-6" />
        <p class="mb-4">
          We're Now Focusing On Generative Art And No Longer Support NFT
          Creation.
        </p>
        <p class="mb-4">
          Interested In Launching Your Generative Collection With KodaDot?
          <a
            href="https://form.kodadot.xyz/drop-interest"
            class="text-blue-500 underline"
            >Fill Out This Form</a
          >
          To Learn More And Join Our Successful Drops.
        </p>
        <p class="">
          For Code Structure Guidelines, Refer To Our
          <a
            href="https://hello.kodadot.xyz/generative/generative-art"
            class="text-blue-500 underline"
            >Documentation</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
