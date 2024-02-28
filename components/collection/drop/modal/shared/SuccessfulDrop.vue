<template>
  <SuccessfulModalBody
    :tx-hash="txHash"
    :share="share"
    :action-buttons="actionButtons">
    <SingleItemMedia
      v-if="singleMint"
      :header="$t('drops.youSuccessfullyClaimedNft', [1])"
      :src="sanitizeIpfsUrl(mintedNft.image)"
      :nft-name="mintedNft.name"
      :collection-id="mintedNft.collection"
      :collection-name="mintedNft.collectionName" />
    <MultiItemMedia
      v-else
      :header="$t('drops.amountMintedSuccessfully', [items.length])"
      :items="items" />
  </SuccessfulModalBody>
</template>

<script setup lang="ts">
import { MintingSession } from '../../types'

const emit = defineEmits(['list'])
const props = defineProps<{
  mintingSession: MintingSession
  canListNft: boolean
}>()

const mintedNft = computed(() => props.mintingSession.items[0])

const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const sharingTxt = $i18n.t('sharing.nft')

const txHash = computed(() => props.mintingSession.txHash || '')
const share = computed(() => ({ text: sharingTxt, url: nftFullUrl.value }))
const items = computed(() =>
  props.mintingSession.items.map((item) => ({
    id: item.id,
    name: item.name,
    image: sanitizeIpfsUrl(item.image),
  })),
)

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

const nftPath = computed(
  () => `/${mintedNft.value.chain}/gallery/${mintedNft.value.id}`,
)
const nftFullUrl = computed(() => `${window.location.origin}${nftPath.value}`)
const userProfilePath = computed(
  () => `/${urlPrefix.value}/u/${accountId.value}`,
)
const singleMint = computed(() => props.mintingSession.items.length === 1)
const cantList = computed(() => !props.canListNft)

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
  () => props.canListNft,
  (canListNft) => {
    if (canListNft) {
      toast($i18n.t('drops.canList'))
    }
  },
)
</script>
