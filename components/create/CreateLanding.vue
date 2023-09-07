<template>
  <div class="container">
    <h1 class="title is-size-2">{{ $t('mint.landing.heading') }}</h1>

    <div v-if="select === 'landing'" class="pack">
      <nuxt-link class="pack-box" to="/create/collection">
        <div class="pack-content">
          <NeoIcon icon="image-polaroid" size="large" />
          <p class="is-size-4 has-text-weight-bold mt-4">Collection</p>
          <p>{{ $t('mint.landing.collection') }}</p>
        </div>
      </nuxt-link>
      <a class="pack-box" @click="select = 'nft'">
        <div class="pack-content">
          <NeoIcon icon="gem" size="large" />
          <p class="is-size-4 has-text-weight-bold mt-4">NFT</p>
          <p>{{ $t('mint.landing.nft') }}</p>
        </div>
      </a>
    </div>

    <div v-if="select === 'nft'" class="pack">
      <nuxt-link class="pack-box" to="/create/nft">
        <div class="pack-content">
          <NeoIcon icon="image" size="large" />
          <p class="is-size-4 has-text-weight-bold mt-4">
            {{ $t('mint.landing.singleNft') }}
          </p>
          <p>{{ $t('mint.landing.singleNftDesc') }}</p>
        </div>
      </nuxt-link>
      <nuxt-link class="pack-box" :to="`/${urlPrefix}/massmint`">
        <div class="pack-content">
          <NeoIcon icon="photo-film" size="large" />
          <p class="is-size-4 has-text-weight-bold mt-4">
            {{ $t('mint.landing.massNft') }}
          </p>
          <p>{{ $t('mint.landing.massNftDesc') }}</p>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const { urlPrefix } = usePrefix()

const select = ref<'landing' | 'nft'>('landing')
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100vh - 5.25rem);
  margin: 0;
  max-width: 100%;

  @include ktheme() {
    background-color: theme('k-primaryLight');
  }

  @include touch() {
    height: 100vh;
  }
}

.pack {
  display: flex;
  gap: 1.5rem;

  &-box {
    padding: 4rem 2rem;

    @include ktheme() {
      background-color: theme('background-color');
      border: 1px solid theme('card-border-color');
    }
  }

  &-content {
    text-align: center;
    width: 14rem;
  }
}
</style>
