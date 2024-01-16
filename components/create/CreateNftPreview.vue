<template>
  <div class="preview">
    <p class="has-text-weight-bold">{{ $t('mint.nft.preview.title') }}</p>

    <div class="preview-card border bg-background-color">
      <div
        class="preview-image flex items-center"
        :style="{ backgroundImage: `url(${image})` }">
        <p v-if="!image" class="p-4 text-xs text-align-center">
          {{ $t('mint.nft.preview.uploadArt') }}
        </p>
      </div>
      <div class="preview-content border-t p-3">
        <p
          class="has-text-weight-bold is-ellipsis"
          data-testid="nft-preview-name">
          {{ name || 'Untitled' }}
        </p>
        <p class="text-xs is-ellipsis text-k-grey">
          {{ collection || $t('mint.nft.preview.noCollection') }}
        </p>

        <div class="flex justify-between items-center mt-2">
          <p class="" data-testid="nft-preview-price">
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

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.preview {
  position: fixed;
  top: 10rem;
  left: 75%;

  @include until-fullhd {
    left: unset;
    right: 2rem;
  }

  &-card {
    width: 15rem;
  }

  &-image {
    background-color: #d7d7d7;
    background-size: cover;
    background-position: center;
    height: 15rem;
  }

  @include touch() {
    display: none;
  }
}
</style>
