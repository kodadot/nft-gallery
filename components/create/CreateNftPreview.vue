<template>
  <div class="fixed top-40 left-3/4 max-fullhd:left-auto max-fullhd:right-8 max-lg:hidden">
    <p class="font-bold">
      {{ $t('mint.nft.preview.title') }}
    </p>

    <div class="w-60 border bg-background-color">
      <div
        class="h-60 flex items-center bg-[#d7d7d7] bg-cover bg-center"
        :style="{ backgroundImage: `url(${image})` }"
      >
        <p
          v-if="!image"
          class="p-4 text-xs text-center"
        >
          {{ $t('mint.nft.preview.uploadArt') }}
        </p>
      </div>
      <div class="border-t p-3">
        <p
          class="font-bold truncate"
          data-testid="nft-preview-name"
        >
          {{ name || 'Untitled' }}
        </p>
        <p class="text-xs truncate text-k-grey">
          {{ collection || $t('mint.nft.preview.noCollection') }}
        </p>

        <div class="flex justify-between items-center mt-2">
          <p
            class=""
            data-testid="nft-preview-price"
          >
            {{ price || '$$$' }} {{ symbol }}
          </p>
          <p class="capitalize text-xs text-k-grey">
            {{ chain ? getChainNameByPrefix(chain) : '--' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getChainNameByPrefix } from '@/utils/chain'

defineProps<{
  name?: string
  collection?: string
  price?: string | number
  symbol?: string
  chain?: string
  image?: string
}>()
</script>
