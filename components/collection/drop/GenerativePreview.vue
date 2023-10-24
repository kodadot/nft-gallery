<template>
  <div class="fixed-size mt-6">
    <div
      class="fixed-top-left border px-4 py-2 theme-background-color has-z-index-1 no-wrap">
      {{ $t('mint.unlockable.onlyOneExample') }}
    </div>

    <MediaItem
      :src="sanitizeIpfsUrl(displayUrl)"
      :mime-type="generativeImageUrl ? 'text/html' : ''"
      preview
      is-detail
      class="border" />
    <div class="is-flex is-flex-direction-column is-align-items-center">
      <NeoButton
        class="mt-4"
        :loading="isLoading"
        no-shadow
        :disabled="!accountId"
        @click="generateNft">
        {{
          generativeImageUrl
            ? $t('mint.unlockable.variations')
            : $t('mint.unlockable.run')
        }}
      </NeoButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MediaItem, NeoButton } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { getRandomInt } from '../unlockable/utils'
import { encodeAddress } from '@polkadot/util-crypto'
import { stringToHex } from '@polkadot/util'

const props = defineProps<{
  content: string
  image?: string
}>()

const emit = defineEmits(['select'])

const { accountId } = useAuth()
const getHash = () => {
  // https://github.com/paritytech/ss58-registry/blob/30889d6c9d332953a6e3333b30513eef89003f64/ss58-registry.json#L1292C17-L1292C22
  return stringToHex(encodeAddress(accountId.value, getRandomInt(15000)))
}

const generativeImageUrl = ref('')
const isLoading = ref(false)
const displayUrl = computed(() => {
  return generativeImageUrl.value || props.image
})
const generateNft = async () => {
  isLoading.value = true
  const hash = generativeImageUrl.value ? getHash() : accountId.value
  const metadata = `${props.content}/?hash=${hash}`
  generativeImageUrl.value = metadata
  emit('select', generativeImageUrl.value)

  setTimeout(() => {
    isLoading.value = false
  }, 3000)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.fixed-size {
  width: 580px;
  position: relative;

  @include mobile {
    width: 100% !important;
    height: 100% !important;
    max-width: 560px;
  }
  @include tablet-only {
    width: 768px;
  }
}

.fixed-top-left {
  border-radius: 3rem;
  position: absolute;
  left: 26px;
  top: -14px;
  @include mobile {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
