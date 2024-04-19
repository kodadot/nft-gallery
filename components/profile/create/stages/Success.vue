<template>
  <div>
    <div class="border-b border-neutral-5">
      <div
        class="border border-k-shade rounded-[4rem] py-[7px] px-2 flex items-center justify-between">
        <div
          class="text-k-green flex px-2 py-[6px] bg-k-green-accent-2 rounded-full justify-center w-full">
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
    <div class="flex justify-between w-full">
      <NeoButton
        class="w-[150px]"
        variant="secondary-rounded"
        :label="$t('close')"
        @click="emit('close')" />
      <NeoButton
        class="!w-[150px]"
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
