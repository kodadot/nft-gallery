<template>
  <SuccessfulModalBody
    :tx-hash="txHash"
    :share="share"
    :action-buttons="actionButtons">
    <SuccessfulItemsMedia
      :header="{
        single: $t('drops.youSuccessfullyClaimedNft', [1]),
        multiple: $t('drops.amountMintedSuccessfully', [items.length]),
      }"
      :items="items" />
  </SuccessfulModalBody>
</template>

<script setup lang="ts">
import type { ItemMedia } from '@/components/common/successfulModal/SuccessfulItemsMedia.vue'
import { MintedNFT, MintingSession } from '../../types'
import { ShareProp } from '@/components/common/successfulModal/SuccessfulModalBody.vue'

const emit = defineEmits(['list'])
const props = defineProps<{
  mintingSession: MintingSession
  canListNfts: boolean
}>()

const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { getCollectionFrameUrl } = useSocialShare()

const cantList = computed(() => !props.canListNfts)
const txHash = computed(() => props.mintingSession.txHash ?? '')
const singleMint = computed(() => props.mintingSession.items.length === 1)
const mintedNft = computed<MintedNFT | undefined>(
  () => props.mintingSession.items[0],
)

const items = computed<ItemMedia[]>(() =>
  props.mintingSession.items.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    collection: item.collection.id,
    collectionName: item.collection.name,
    mimeType: item.mimeType,
  })),
)

const nftPath = computed(
  () => `/${mintedNft.value?.chain}/gallery/${mintedNft.value?.id}`,
)
const nftFullUrl = computed(() => `${window.location.origin}${nftPath.value}`)
const userProfilePath = computed(
  () => `/${urlPrefix.value}/u/${accountId.value}`,
)

const sharingTxt = computed(() =>
  singleMint.value
    ? $i18n.t('sharing.dropNft', [`#${mintedNft.value?.index}`])
    : $i18n.t('sharing.dropNfts', [
        props.mintingSession.items.map((item) => `#${item.index}`).join(', '),
      ]),
)

const share = computed<ShareProp>(() => ({
  text: sharingTxt.value,
  url: nftFullUrl.value,
  withCopy: singleMint.value,
  social: {
    farcaster: {
      embeds: [
        getCollectionFrameUrl(
          urlPrefix.value,
          mintedNft.value?.collection.id as string,
        ),
      ],
    },
  },
}))

const actionButtons = computed(() => ({
  secondary: {
    label: $i18n.t('viewNft', props.mintingSession.items.length),
    onClick: handleViewNft,
  },
  primary: {
    label: $i18n.t('listNft', props.mintingSession.items.length),
    onClick: listNft,
    disabled: cantList.value,
  },
}))

const handleViewNft = () => {
  window.open(
    singleMint.value ? nftPath.value : userProfilePath.value,
    '_blank',
  )
}

const listNft = () => {
  emit('list')
}

watch(
  () => props.canListNfts,
  (canListNft) => {
    if (canListNft) {
      toast($i18n.t('drops.canList'))
    }
  },
)
</script>
