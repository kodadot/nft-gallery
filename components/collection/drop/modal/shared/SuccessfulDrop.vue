<template>
  <SuccessfulModalBody
    :tx-hash="txHash"
    :share="share"
    :action-buttons="actionButtons">
    <SingleItemMedia
      :header="$t('drops.youSuccessfullyClaimedNft', [1])"
      :src="sanitizeIpfsUrl(mintedNft.image)"
      :nft-name="mintedNft.name"
      :collection-id="mintedNft.collection"
      :collection-name="mintedNft.collectionName" />
  </SuccessfulModalBody>
</template>

<script setup lang="ts">
import type { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'

const emit = defineEmits(['list'])
const props = defineProps<{
  mintedNft: DropMintedNft
  canListNft: boolean
}>()

const { $i18n } = useNuxtApp()
const { toast } = useToast()

const sharingTxt = $i18n.t('sharing.nft')

const txHash = computed(() => props.mintedNft.txHash || '')
const share = computed(() => ({ text: sharingTxt, url: nftFullUrl.value }))

const actionButtons = computed(() => ({
  secondary: {
    label: $i18n.t('viewNft'),
    onClick: viewNft,
  },
  primary: {
    label: $i18n.t('listNft'),
    onClick: listNft,
    disabled: cantList.value,
  },
}))

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

watch(
  () => props.canListNft,
  (canListNft) => {
    if (canListNft) {
      toast($i18n.t('drops.canList'))
    }
  },
)
</script>
