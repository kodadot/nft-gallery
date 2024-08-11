<template>
  <SuccessfulModalBody
    :tx-hash="txHash"
    :share="share"
    :status="status"
    :action-buttons="actionButtons"
  >
    <SuccessfulItemsMedia
      :header="{
        single: $t('drops.youSuccessfullyClaimedNft', [1]),
        multiple: $t('drops.amountMintedSuccessfully', [items.length]),
      }"
      :items="items"
    />
  </SuccessfulModalBody>
</template>

<script setup lang="ts">
import type { MintedNFT, MintingSession } from '../../types'
import type { ItemMedia } from '@/components/common/successfulModal/SuccessfulItemsMedia.vue'
import type { ShareProp } from '@/components/common/successfulModal/SuccessfulModalBody.vue'
import type { TransactionStatus } from '@/composables/useTransactionStatus'
import { listVisible } from '@/utils/config/permission.config'

const emit = defineEmits(['list'])
const props = defineProps<{
  mintingSession: MintingSession
  canListNfts: boolean
  status: TransactionStatus
}>()

const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { getCollectionFrameUrl } = useSocialShare()
const { toMintNFTs } = storeToRefs(useDropStore())

const cantList = computed(() => !props.canListNfts)
const txHash = computed(() => props.mintingSession.txHash ?? '')
const singleMint = computed(() => props.mintingSession.items.length === 1)
const mintedNft = computed<MintedNFT | undefined>(
  () => props.mintingSession.items[0],
)

const itemMedias = props.mintingSession.items.map(item => ({
  id: item.id,
  name: item.name,
  image: item.image,
  collection: item.collection.id,
  collectionName: item.collection.name,
  mimeType: item.mimeType,
  metadata: item.metadata,
}))
const items = ref<ItemMedia[]>(itemMedias)

// update serial number in nft.name asynchronously
onMounted(async () => {
  const metadatas = await Promise.all(
    items.value.map(item => $fetch<{ name?: string }>(item.metadata)),
  )

  items.value.forEach((_, index) => {
    const metadata = metadatas[index]
    if (metadata.name) {
      items.value[index].name = metadata.name
      toMintNFTs.value[index].name = metadata.name
    }
  })
})

const nftPath = computed(
  () =>
    `/${mintedNft.value?.chain}/gallery/${mintedNft.value?.collection.id}-${mintedNft.value?.id}`,
)
const nftFullUrl = computed(() => `${window.location.origin}${nftPath.value}`)
const userProfilePath = computed(
  () => `/${urlPrefix.value}/u/${accountId.value}`,
)

const getItemSn = (name: string) => `#${name.split('#')[1]}`

const sharingTxt = computed(() =>
  singleMint.value
    ? $i18n.t('sharing.dropNft', [getItemSn(items.value[0].name)])
    : $i18n.t('sharing.dropNfts', [
      items.value.map(item => getItemSn(item.name)).join(', '),
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

const viewButton = computed(() => ({
  label: $i18n.t('viewNft', props.mintingSession.items.length),
  onClick: handleViewNft,
}))

const listButton = computed(() => ({
  label: $i18n.t('listNft', props.mintingSession.items.length),
  onClick: listNft,
  disabled: cantList.value,
}))

const actionButtons = computed(() =>
  listVisible(urlPrefix.value)
    ? {
        secondary: viewButton.value,
        primary: listButton.value,
      }
    : { primary: viewButton.value },
)

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
