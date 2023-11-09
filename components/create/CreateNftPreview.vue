<template>
  <div class="preview">
    <p class="has-text-weight-bold">{{ $t('mint.nft.preview.title') }}</p>

    <div class="preview-card border theme-background-color">
      <div
        class="preview-image is-flex is-align-items-center"
        :style="{ backgroundImage: `url(${image})` }">
        <p v-if="!image" class="p-4 is-size-7 text-align-center">
          {{ $t('mint.nft.preview.uploadArt') }}
        </p>
      </div>
      <div class="preview-content border-top p-3">
        <p
          class="has-text-weight-bold is-ellipsis"
          data-testid="nft-preview-name">
          {{ name || 'Untitled' }}
        </p>
        <p class="is-size-7 is-ellipsis has-text-grey">
          {{ collection || $t('mint.nft.preview.noCollection') }}
        </p>

        <div
          class="is-flex is-justify-content-space-between is-align-items-center mt-2">
          <p class="" data-testid="nft-preview-price">
            {{ price || '$$$' }} {{ symbol }}
          </p>
          <p class="is-capitalized is-size-7 has-text-grey">
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
