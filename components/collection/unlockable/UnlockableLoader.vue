<template>
  <NeoLoading v-model:active="isLoading" is-full-page :can-cancel="canCancel">
    <div class="loading-container py-2">
      <NeoButton
        class="close-icon py-1 px-2"
        variant="text"
        no-shadow
        icon="xmark"
        size="medium"
        @click="closeLoading" />
      <img src="/unlockable-loader.svg" />
      <div
        class="is-flex is-flex-direction-column is-align-items-center px-5 has-text-centered is-capitalized">
        <div class="has-text-weight-bold mb-2">{{ $t('mint.success') }}</div>
        <div>
          {{ $t('mint.unlockable.loader.viewNFT1') }}
          <span v-if="minted">
            {{ $t('mint.unlockable.loader.viewNFTNow2') }}
            <span class="has-text-weight-bold">
              {{ $t('mint.unlockable.loader.viewNFTNow3') }}</span
            >
          </span>
          <span v-else>
            {{ $t('mint.unlockable.loader.viewNFTLater2') }}
            <span class="has-text-weight-bold">
              {{ displayDuration }}
            </span>
          </span>
        </div>
        <div class="mt-4">
          {{ $t('mint.unlockable.loader.shareSuccess') }}
          <a v-safe-href="postTwitterUrl" target="_blank" class="has-text-link"
            >{{ $t('mint.unlockable.loader.onTwitter') }}
          </a>
        </div>
        <nuxt-link :to="`/${urlPrefix}/gallery/${minted}`">
          <NeoButton
            class="mb-2 mt-4 loading-button is-size-6"
            variant="secondary"
            tag="span"
            :disabled="!minted"
            :label="buttonLabel" />
        </nuxt-link>
      </div>
    </div>
  </NeoLoading>
</template>

<script lang="ts" setup>
import { NeoButton, NeoLoading } from '@kodadot1/brick'
import { resolveComponent } from 'vue'
import { useCountDown } from './utils/useCountDown'

const NuxtLink = resolveComponent('NuxtLink')
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    canCancel?: boolean
    minted?: string
    duration?: number
  }>(),
  {
    modelValue: false,
    canCancel: true,
    duration: 51, // second
    minted: '',
  },
)
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const isLoading = useVModel(props, 'modelValue')

const { displayDuration } = useCountDown(
  new Date().getTime() + props.duration * 1000,
)

const twitterText = computed(
  () =>
    `Just minted an exclusive NFT with unlockable items on @Kodadot! 🎉 So excited to add this unique collectible to my collection. Do not miss your chance! \n\n ${location.href}`,
)

const postTwitterUrl = computed(
  () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      twitterText.value,
    )}`,
)
const emit = defineEmits(['modelValue'])

const closeLoading = () => {
  emit('modelValue', false)
}
const buttonLabel = computed(() =>
  $i18n.t(
    props.minted ? 'mint.unlockable.viewItem' : 'mint.unlockable.preparing',
  ),
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.loading-container {
  background: $white;
  backdrop-filter: $frosted-glass-backdrop-filter;
  margin: 0rem 1rem;
  width: 385px;
  min-height: 356px;

  @include ktheme() {
    box-shadow: theme('primary-shadow');
    border: 1px solid theme('border-color');
    background: theme('background-color');
  }
  .close-icon {
    position: absolute;
    right: 20px;
    top: 10px;
  }
  .loading-button {
    height: 35px;
    min-width: 126px;
  }
}
</style>
