<template>
  <NeoLoading :active.sync="isLoading" is-full-page :can-cancel="canCancel">
    <div class="loading-container py-2">
      <NeoIcon class="close-icon" icon="close" @click.native="closeLoading" />
      <img :src="unloackableLoaderImg" />
      <div
        class="is-flex is-flex-direction-column is-align-items-center px-5 has-text-centered is-capitalized">
        <div class="has-text-weight-bold mb-2">Congratulations</div>
        <div class="">
          Get ready for the big reveal! Your NFT will be visible
          <span class="has-text-weight-bold"
            >{{ minted ? 'by now.' : 'in just 30 seconds.' }}
          </span>
        </div>
        <div v-if="minted" class="mt-4">
          Share your success
          <a :href="postTwitterUrl" target="_blank" class="has-text-link"
            >on Twitter
          </a>
        </div>
        <NeoButton
          class="mb-2 mt-4 loading-button is-size-6"
          variant="secondary"
          tag="nuxt-link"
          :to="`/${urlPrefix}/gallery/${minted}`"
          :disabled="!minted"
          :label="buttonLabel" />
      </div>
    </div>
  </NeoLoading>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon, NeoLoading } from '@kodadot1/brick'
import unloackableLoaderImg from '@/assets/unlockable-loader.svg'

const props = withDefaults(
  defineProps<{
    value: boolean
    canCancel?: boolean
    minted?: string
  }>(),
  {
    value: false,
    canCancel: true,
    minted: '',
  }
)
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const isLoading = useVModel(props, 'value')

const postTwitterUrl = computed(
  () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Just minted an exclusive NFT with unlockable items on @Kodadot! 🎉 So excited to add this unique collectible to my collection. Don't miss your chance! \n\n https://kodadot.xyz/stmn/gallery/${props.minted}`
    )}`
)

const emit = defineEmits(['input'])

const closeLoading = () => {
  emit('input', false)
}
const buttonLabel = computed(() =>
  $i18n.t(
    props.minted ? 'mint.unlockable.viewItem' : 'mint.unlockable.preparing'
  )
)
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

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
    right: 28px;
    top: 17px;
    cursor: pointer;
  }
  .loading-button {
    height: 35px;
    min-width: 126px;
  }
}
</style>
