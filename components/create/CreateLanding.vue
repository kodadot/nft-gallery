<template>
  <div class="h-[calc(100vh-5.25rem)] m-0 max-w-full flex items-center justify-center flex-col bg-k-primary-light max-lg:h-screen max-sm:px-8">
    <div>
      <h1 class="text-[2.5rem] mb-7 max-sm:text-2xl font-bold">
        {{ $t('mint.landing.heading') }}
      </h1>

      <div
        v-if="route.query?.select !== 'nft'"
        class="flex gap-6"
      >
        <div
          class="cursor-pointer px-8 py-16 bg-background-color border border-card-border-color text-text-color hover:border-text-color hover:text-text-color max-sm:p-8"
          @click="gotoPathAfterLogin('/create/collection')"
        >
          <div class="text-center w-56 max-sm:flex max-sm:gap-8 max-sm:text-left max-sm:w-full">
            <NeoIcon
              icon="image-polaroid"
              custom-size="fa-3x"
            />
            <div class="mt-8 max-sm:mt-0">
              <p class="text-2xl font-bold">
                Collection
              </p>
              <p>{{ $t('mint.landing.collection') }}</p>
            </div>
          </div>
        </div>
        <button
          class="cursor-pointer px-8 py-16 bg-background-color border border-card-border-color text-text-color hover:border-text-color hover:text-text-color max-sm:p-8"
          data-testid="create-landing-nft-button"
          @click="router.push({ query: { select: 'nft' } })"
        >
          <div class="text-center w-56 max-sm:flex max-sm:gap-8 max-sm:text-left max-sm:w-full">
            <NeoIcon
              icon="gem"
              custom-size="fa-3x"
            />
            <div class="mt-8 max-sm:mt-0">
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
        class="flex gap-6 max-sm:flex-col"
      >
        <div
          class="cursor-pointer px-8 py-16 bg-background-color border border-card-border-color text-text-color hover:border-text-color hover:text-text-color max-sm:p-8"
          data-testid="create-landing-single-nft-button"
          @click="gotoPathAfterLogin('/create/nft')"
        >
          <div class="text-center w-56 max-sm:flex max-sm:gap-8 max-sm:text-left max-sm:w-full">
            <NeoIcon
              icon="image"
              custom-size="fa-3x"
            />
            <div class="mt-8 max-sm:mt-0">
              <p class="text-2xl font-bold">
                {{ $t('mint.landing.singleNft') }}
              </p>
              <p>{{ $t('mint.landing.singleNftDesc') }}</p>
            </div>
          </div>
        </div>
        <div
          class="cursor-pointer px-8 py-16 bg-background-color border border-card-border-color text-text-color hover:border-text-color hover:text-text-color max-sm:p-8"
          data-testid="create-landing-multiple-nft-button"
          @click="gotoPathAfterLogin(`/${urlPrefix}/massmint`)"
        >
          <div class="text-center w-56 max-sm:flex max-sm:gap-8 max-sm:text-left max-sm:w-full">
            <NeoIcon
              icon="photo-film"
              custom-size="fa-3x"
            />
            <div class="mt-8 max-sm:mt-0">
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

const { doAfterLogin } = useDoAfterlogin()
const { urlPrefix } = usePrefix()
const route = useRoute()
const router = useRouter()

const gotoPathAfterLogin = (path) => {
  doAfterLogin({
    onLoginSuccess: () => {
      navigateTo({ path, query: { collectionId: route.query.collectionId } })
    },
  })
}
</script>
