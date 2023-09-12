<template>
  <div
    class="container is-flex is-align-items-center is-justify-content-center is-flex-direction-column">
    <h1 class="title is-size-2">{{ $t('mint.landing.heading') }}</h1>

    <div v-if="select === 'landing'" class="pack">
      <nuxt-link class="pack-box" to="/create/collection">
        <div class="pack-content">
          <NeoIcon icon="image-polaroid" size="large" />
          <div class="pack-content-text">
            <p class="is-size-4 has-text-weight-bold">Collection</p>
            <p>{{ $t('mint.landing.collection') }}</p>
          </div>
        </div>
      </nuxt-link>
      <a class="pack-box" @click="select = 'nft'">
        <div class="pack-content">
          <NeoIcon icon="gem" size="large" />
          <div class="pack-content-text">
            <p class="is-size-4 has-text-weight-bold">NFT</p>
            <p>{{ $t('mint.landing.nft') }}</p>
          </div>
        </div>
      </a>
    </div>

    <div v-if="select === 'nft'" class="pack">
      <nuxt-link class="pack-box" to="/create/nft">
        <div class="pack-content">
          <NeoIcon icon="image" size="large" />
          <div class="pack-content-text">
            <p class="is-size-4 has-text-weight-bold">
              {{ $t('mint.landing.singleNft') }}
            </p>
            <p>{{ $t('mint.landing.singleNftDesc') }}</p>
          </div>
        </div>
      </nuxt-link>
      <nuxt-link class="pack-box" :to="`/${urlPrefix}/massmint`">
        <div class="pack-content">
          <NeoIcon icon="photo-film" size="large" />
          <div class="pack-content-text">
            <p class="is-size-4 has-text-weight-bold">
              {{ $t('mint.landing.massNft') }}
            </p>
            <p>{{ $t('mint.landing.massNftDesc') }}</p>
          </div>
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
  height: calc(100vh - 5.25rem); // 5.25rem = header height
  margin: 0;
  max-width: 100% !important;

  @include ktheme() {
    background-color: theme('k-primaryLight');
  }

  @include touch() {
    height: 100vh;
  }

  @include mobile() {
    padding: 0 2rem;

    .title {
      font-size: 2rem !important;
    }
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

    &-text {
      margin-top: 2rem;
    }
  }

  @include mobile() {
    flex-direction: column;
    width: 100%;

    &-box {
      padding: 2rem;
    }

    &-content {
      display: flex;
      gap: 2rem;
      text-align: left;
      width: 100%;

      &-text {
        margin-top: 0;
      }
    }
  }
}
</style>
