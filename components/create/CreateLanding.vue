<template>
  <div
    class="container m-0 bg-k-primary-light flex items-center justify-center flex-col">
    <div>
      <h1 class="title is-size-2 mb-7">{{ $t('mint.landing.heading') }}</h1>

      <div v-if="route.query?.select !== 'nft'" class="pack flex gap-6 mt-8">
        <div
          class="pack-box"
          @click="gotoPathAfterLogin(`/${urlPrefix}/create/collection`)">
          <div class="pack-content">
            <NeoIcon icon="image-polaroid" custom-size="fa-3x" />
            <div class="mt-0 md:mt-8">
              <p class="is-size-4 font-bold">{{ $t('collection') }}</p>
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
            <div class="mt-0 md:mt-8">
              <p class="is-size-4 font-bold">{{ $t('general.nft') }}</p>
              <p>{{ $t('mint.landing.nft') }}</p>
            </div>
          </div>
        </button>
        <nuxt-link
          v-if="urlPrefix === 'ahk'"
          :class="{ 'pack-box-waifu p-0 is-relative': !isMobile }"
          class="pack-box flex items-center justify-center"
          :to="`/${urlPrefix}/waifu`">
          <div
            :class="{
              'flex h-full pack-content-waifu text-center flex-col': !isMobile,
              'pack-content': isMobile,
            }">
            <img
              v-if="!isMobile"
              :src="isDarkMode ? '/waifu-dark.svg' : '/waifu.svg'"
              class="svg-one"
              alt="Create Waifu NFT" />
            <NeoIcon v-else icon="wand-magic-sparkles" custom-size="fa-3x" />

            <div class="px-3 flex h-full flex-col justify-center">
              <p class="is-size-4 font-bold">
                {{ !isMobile ? $t('navbar.create.generateWaifu') : 'Waifu' }}
              </p>
              <p>{{ $t('createDropdown.waifu') }}</p>
            </div>
          </div>

          <div
            v-if="!isMobile"
            class="time-limit absolute rounded-[6rem] top-4 px-2 py-1gi">
            <span class="text-xs">{{ $t('navbar.create.timeLimit') }}</span>
          </div>
        </nuxt-link>
      </div>

      <div v-else class="pack flex gap-6 mt-8">
        <div
          class="pack-box"
          data-testid="create-landing-single-nft-button"
          @click="gotoPathAfterLogin(`/${urlPrefix}/create/nft`)">
          <div class="pack-content">
            <NeoIcon icon="image" custom-size="fa-3x" />
            <div class="mt-0 md:mt-8">
              <p class="is-size-4 font-bold">
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
            <div class="mt-0 md:mt-8">
              <p class="is-size-4 font-bold">
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

const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const { urlPrefix } = usePrefix()
const route = useRoute()
const router = useRouter()
const { isDarkMode } = useTheme()
const { isMobile } = useViewport()

const gotoPathAfterLogin = (path: string) => {
  doAfterLogin({
    onLoginSuccess: () =>
      navigateTo({
        path,
        query: { collectionId: route.query.collectionId },
      }),
  })
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.container {
  height: calc(100vh - 5.25rem); // 5.25rem = header height
  max-width: 100% !important;

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

  @include mobile() {
    flex-direction: column;
    width: 100%;

    &-box {
      padding: 2rem;
    }

    &-content {
      @apply flex gap-8 text-left w-full;
    }
  }
}
</style>
