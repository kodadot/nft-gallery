<template>
  <div>
    <div class="border-b border-neutral-5">
      <div class="border border-k-shade rounded-full p-2">
        <div
          class="text-k-green flex py-[6px] bg-k-green-accent-2 rounded-full justify-center w-full">
          <NeoIcon icon="check" />
          <p class="ml-2 text-xs">{{ $t('confirmed') }}</p>
        </div>
      </div>
      <h3 class="my-5 font-bold text-center">Profile created successfully</h3>
    </div>
    <ShareSocialsSection
      class="mb-6"
      :text="$t('sharing.profile')"
      :show-farcaster="false"
      :url="profileUrl" />
    <div
      class="max-[400px]:flex-wrap max-[400px]:justify-center max-[400px]:gap-4 flex justify-between w-full">
      <NeoButton
        class="min-[400px]:w-[150px] w-full"
        variant="secondary-rounded"
        :label="$t('close')"
        @click="emit('close')" />
      <NeoButton
        class="min-[400px]:!w-[150px] !w-full"
        variant="primary-rounded"
        :label="'Go To Profile'"
        @click="emit('close')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'

const emit = defineEmits(['close'])

const profileUrl = window.location.href
</script>
