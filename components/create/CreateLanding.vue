<template>
  <div class="container flex items-center justify-center flex-col">
    <div>
      <h1 class="title text-[2.5rem] mb-7">{{ $t('mint.landing.heading') }}</h1>

      <div v-if="route.query?.select !== 'nft'" class="pack">
        <div class="pack-box" @click="gotoPathAfterLogin('/create/collection')">
          <div class="pack-content">
            <NeoIcon icon="image-polaroid" custom-size="fa-3x" />
            <div class="pack-content-text">
              <p class="text-2xl font-bold">Collection</p>
              <p>{{ $t('mint.landing.collection') }}</p>
            </div>
          </div>
        </div>
        <button
          class="pack-box"
          data-testid="create-landing-nft-button"
          @click="router.push({ query: { select: 'nft' } })">
          <div class="pack-content">
            <NeoIcon icon="gem" custom-size="fa-3x" />
            <div class="pack-content-text">
              <p class="text-2xl font-bold">NFT</p>
              <p>{{ $t('mint.landing.nft') }}</p>
            </div>
          </div>
        </button>
        <nuxt-link
          v-if="urlPrefix === 'ahk'"
          class="pack-box flex items-center justify-center md:pack-box-waifu md:p-0 md:relative"
          :to="`/${urlPrefix}/waifu`">
          <div
            class="sm:max-md:pack-content md:flex md:h-full md:pack-content-waifu md:text-center md:flex-col">
            <img
              :src="isDarkMode ? '/waifu-dark.svg' : '/waifu.svg'"
              class="svg-one invisible md:visible"
              alt="Create Waifu NFT" />
            <NeoIcon
              class="visible md:invisible"
              icon="wand-magic-sparkles"
              custom-size="fa-3x" />

            <div class="px-3 flex h-full flex-col justify-center">
              <p class="text-2xl font-bold">
                {{ !isMobile ? $t('navbar.create.generateWaifu') : 'Waifu' }}
              </p>
              <p>{{ $t('createDropdown.waifu') }}</p>
            </div>
          </div>

          <div
            class="time-limit absolute rounded-[6rem] top-4 px-2 py-1 invisible md:visible">
            <span class="text-xs">{{ $t('navbar.create.timeLimit') }}</span>
          </div>
        </nuxt-link>
      </div>

      <div v-else class="pack">
        <div
          class="pack-box"
          data-testid="create-landing-single-nft-button"
          @click="gotoPathAfterLogin('/create/nft')">
          <div class="pack-content">
            <NeoIcon icon="image" custom-size="fa-3x" />
            <div class="pack-content-text">
              <p class="text-2xl font-bold">
                {{ $t('mint.landing.singleNft') }}
              </p>
              <p>{{ $t('mint.landing.singleNftDesc') }}</p>
            </div>
          </div>
        </div>
        <div
          class="pack-box"
          data-testid="create-landing-multiple-nft-button"
          @click="gotoPathAfterLogin(`/${urlPrefix}/massmint`)">
          <div class="pack-content">
            <NeoIcon icon="photo-film" custom-size="fa-3x" />
            <div class="pack-content-text">
              <p class="text-2xl font-bold">
                {{ $t('mint.landing.massNft') }}
              </p>
              <p>{{ $t('mint.landing.massNftDesc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import type { RawLocation } from 'vue-router/types/router'

const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const { urlPrefix } = usePrefix()
const route = useRoute()
const router = useRouter()
const { isDarkMode } = useTheme()
const { isMobile } = useViewport()

const gotoPathAfterLogin = (path: RawLocation) => {
  doAfterLogin({
    onLoginSuccess: () => {
      navigateTo({ path, query: { collectionId: route.query.collectionId } })
    },
  })
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

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
    @apply cursor-pointer text-[unset] px-8 py-16;

    @include ktheme() {
      background-color: theme('background-color');
      border: 1px solid theme('card-border-color');
      color: theme('text-color');

      &:hover {
        color: theme('text-color');
        border-color: theme('text-color');
      }
    }
  }

  &-content {
    @apply text-center w-56;

    &-text {
      margin-top: 2rem;
    }
  }

  &-box-waifu {
    width: 17rem;

    .time-limit {
      @include ktheme() {
        border: 1px solid theme('k-grey');
        background-color: theme('background-color');
      }
    }
  }

  &-content-waifu {
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
      @apply flex gap-8 text-left w-full;

      &-text {
        margin-top: 0;
      }
    }
  }
}
</style>
