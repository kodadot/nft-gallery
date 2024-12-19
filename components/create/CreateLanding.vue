<template>
  <div class="container flex items-center justify-center flex-col">
    <div>
      <h1 class="title text-[2.5rem] mb-7">
        {{ $t('mint.landing.heading') }}
      </h1>

      <div
        v-if="route.query?.select !== 'nft'"
        class="pack"
      >
        <div
          class="pack-box"
          @click="gotoPathAfterLogin('/create/collection')"
        >
          <div class="pack-content">
            <NeoIcon
              icon="image-polaroid"
              custom-size="fa-3x"
            />
            <div class="pack-content-text">
              <p class="text-2xl font-bold">
                Collection
              </p>
              <p>{{ $t('mint.landing.collection') }}</p>
            </div>
          </div>
        </div>
        <button
          class="pack-box"
          data-testid="create-landing-nft-button"
          @click="router.push({ query: { select: 'nft' } })"
        >
          <div class="pack-content">
            <NeoIcon
              icon="gem"
              custom-size="fa-3x"
            />
            <div class="pack-content-text">
              <p class="text-2xl font-bold">
                NFT
              </p>
              <p>{{ $t('mint.landing.nft') }}</p>
            </div>
          </div>
        </button>
      </div>

      <div
        v-else
        class="pack"
      >
        <div
          class="pack-box"
          data-testid="create-landing-single-nft-button"
          @click="gotoPathAfterLogin('/create/nft')"
        >
          <div class="pack-content">
            <NeoIcon
              icon="image"
              custom-size="fa-3x"
            />
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
          @click="gotoPathAfterLogin(`/${urlPrefix}/massmint`)"
        >
          <div class="pack-content">
            <NeoIcon
              icon="photo-film"
              custom-size="fa-3x"
            />
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

const { doAfterLogin } = useDoAfterlogin()
const { urlPrefix } = usePrefix()
const route = useRoute()
const router = useRouter()

const gotoPathAfterLogin = (path: RawLocation) => {
  doAfterLogin({
    onLoginSuccess: () => {
      navigateTo({ path, query: { collectionId: route.query.collectionId } })
    },
  })
}
</script>
