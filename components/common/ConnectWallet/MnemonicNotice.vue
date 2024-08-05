<template>
  <div class="bg-k-grey-light p-4 flex items-center mx-6">
    <NeoIcon
      class="ml-1"
      icon="circle-info"
      variant="k-grey"
    />
    <div class="text-xs text-neutral-7 ml-3">
      {{ $t('walletConnect.authText') }}
    </div>
  </div>

  <div class="px-6 !pb-6 pt-2">
    <a
      class="text-sm text-k-blue hover:text-k-blue-hover flex items-center justify-center"
      href="https://hello.kodadot.xyz/tutorial/wallet"
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      {{ $t('walletConnect.walletLink') }}
    </a>
  </div>
</template>
<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
</script>
