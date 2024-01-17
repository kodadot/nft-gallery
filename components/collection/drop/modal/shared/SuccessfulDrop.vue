<template>
  <div
    class="border border-k-shade is-rounded-small py-2 px-5 mb-7 flex items-center justify-between">
    <div class="has-text-k-green flex">
      <NeoIcon icon="check" />

      <p class="ml-3 text-xs">{{ $t('confirmed') }}</p>
    </div>

    <div class="flex items-center">
      <a
        v-safe-href="txUrl"
        class="has-text-link ml-3 text-xs"
        target="_blank"
        rel="nofollow noopener noreferrer">
        {{ $t('helper.viewTx') }}
        <NeoIcon icon="arrow-up-right" />
      </a>

      <NeoIcon
        class="text-k-grey opacity-20 mx-2 is-size-8"
        icon="circle"
        pack="fass"
        size="small" />

      <NeoIcon
        v-clipboard:copy="txUrl"
        icon="copy"
        pack="fass"
        class="text-k-grey is-clickable"
        data-testid="tx-clipboard"
        @click="toast($t('general.copyToClipboard'))" />
    </div>
  </div>

  <BaseMediaItem
    class="border border-k-shade"
    :src="mintedNft.image"
    preview
    is-detail />

  <div class="py-5 border-b-k-shade">
    <p class="is-size-6 capitalize has-text-weight-bold text-center">
      {{ $t('drops.youSuccessfullyClaimedNft', [1]) }}
    </p>
    <p class="capitalize text-xs text-center mt-2">
      {{ $t('drops.artBy', [mintedNft.name]) }}
      <a
        v-safe-href="collectionUrl"
        class="has-text-link"
        target="_blank"
        rel="nofollow noopener noreferrer">
        {{ mintedNft.collectionName }}
      </a>
    </p>
  </div>

  <div class="mt-5 mb-6">
    <div class="flex justify-around px-8 items-center w-full">
      <NeoButton variant="icon" no-shadow @click="handleShareOnX">
        <div class="flex flex-col text-k-grey">
          <NeoIcon pack="fab" icon="x-twitter" />
          <span class="text-center mt-1">X</span>
        </div>
      </NeoButton>

      <NeoButton
        variant="icon"
        no-shadow
        class="mx-7"
        @click="handleShareOnTelegram">
        <div class="flex flex-col text-k-grey">
          <NeoIcon pack="fab" icon="telegram" />
          <span class="text-center mt-1">Telegram</span>
        </div>
      </NeoButton>

      <NeoButton
        v-clipboard:copy="nftFullUrl"
        variant="icon"
        no-shadow
        @click="toast($t('general.copyToClipboard'))">
        <div class="flex flex-col text-k-grey">
          <NeoIcon icon="link" />
          <span class="text-center mt-1">{{ $t('general.copy') }}</span>
        </div>
      </NeoButton>
    </div>
  </div>

  <div class="flex">
    <NeoButton
      class="border-k-grey hover-button w-full"
      rounded
      no-shadow
      @click="viewNft"
      >{{ $t('drops.viewNft') }}</NeoButton
    >

    <NeoButton
      class="hover-button w-full ml-4"
      :class="{ border: canListNft }"
      :disabled="cantList"
      :loading="cantList"
      variant="k-accent"
      rounded
      no-shadow
      loading-with-label
      @click="listNft"
      >{{ cantList ? $t('loading') : $t('drops.listNft') }}</NeoButton
    >
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import type { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'
import { Prefix } from '@kodadot1/static'

const emit = defineEmits(['list'])
const props = defineProps<{
  mintedNft: DropMintedNft
  canListNft: boolean
}>()

const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { getExtrinsicUrl } = useExplorer()
const { shareOnX, shareOnTelegram } = useSocialShare()

const sharingTxt = $i18n.t('sharing.nft')

const txUrl = computed(() =>
  getExtrinsicUrl(
    props.mintedNft.txHash || '',
    props.mintedNft.chain as Prefix,
  ),
)

const collectionUrl = computed(
  () => `/${props.mintedNft.chain}/collection/${props.mintedNft.collection}`,
)

const nftPath = computed(
  () => `/${props.mintedNft.chain}/gallery/${props.mintedNft.id}`,
)

const nftFullUrl = computed(() => `${window.location.origin}${nftPath.value}`)

const cantList = computed(() => !props.canListNft)

const viewNft = () => {
  window.open(nftFullUrl.value, '_blank')
}

const listNft = () => {
  emit('list')
}

const handleShareOnX = () => {
  shareOnX(sharingTxt, nftFullUrl.value)
}

const handleShareOnTelegram = () => {
  shareOnTelegram(sharingTxt, nftFullUrl.value)
}

watch(
  () => props.canListNft,
  (canListNft) => {
    if (canListNft) {
      toast($i18n.t('drops.canList'))
    }
  },
)
</script>
