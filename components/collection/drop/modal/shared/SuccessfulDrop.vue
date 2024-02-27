<template>
  <SuccessfulModalBody
    :tx-hash="txHash"
    :share="share"
    :action-buttons="actionButtons">
    <SingleItemMedia
      v-if="props.mintingSession.items.length === 1"
      :header="$t('drops.youSuccessfullyClaimedNft', [1])"
      :src="sanitizeIpfsUrl(mintedNft.image)"
      :nft-name="mintedNft.name"
      :collection-id="mintedNft.collection"
      :collection-name="mintedNft.collectionName" />
    <MultiItemMedia v-else :items="items" />
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
