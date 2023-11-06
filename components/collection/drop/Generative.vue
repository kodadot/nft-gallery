<template>
  <div class="unlockable-container">
    <CollectionUnlockableLoader v-model="isLoading" :minted="justMinted" />
    <div class="container is-fluid border-top">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <UnlockableCollectionInfo
            :collection-id="collectionId"
            :description="description" />
          <hr class="mb-4" />

          <div
            class="is-flex is-justify-content-space-between is-align-items-center my-5">
            <div>{{ $t('mint.unlockable.totalAvailableItem') }}</div>
            <div>{{ totalAvailableMintCount }} / {{ totalCount }}</div>
          </div>
          <UnlockableTag :collection-id="collectionId" />

          <div>
            <div
              class="is-flex is-justify-content-space-between is-align-items-center my-5">
              <div class="has-text-weight-bold is-size-5">
                {{ $t('mint.unlockable.phase') }}
              </div>
              <div
                v-if="mintCountAvailable"
                class="is-flex is-align-items-center">
                <img src="/unlockable-pulse.svg" alt="open" />
                {{ $t('mint.unlockable.open') }}
              </div>
            </div>
            <div
              class="is-flex is-justify-content-space-between is-align-items-center">
              <div>{{ mintedPercent }} %</div>
              <div class="has-text-weight-bold">
                {{ mintedCount }} / {{ totalCount }}
                {{ $t('statsOverview.minted') }}
              </div>
            </div>
          </div>
          <div class="my-5">
            <UnlockableSlider :value="mintedCount / totalCount" />
          </div>
          <div class="my-5">
            <div
              class="is-flex is-justify-content-flex-end is-align-items-center">
              <div v-if="hasUserMinted" class="is-flex is-align-items-center">
                <div class="mr-2">
                  {{ $t('mint.unlockable.nftAlreadyMinted') }}
                </div>
                <NeoIcon
                  icon="circle-check has-text-success"
                  pack="fass"
                  class="mr-4" />
                <NeoButton
                  class="my-2 mint-button"
                  :tag="NuxtLink"
                  :label="$t('mint.unlockable.seeYourNft')"
                  :to="`/${urlPrefix}/gallery/${hasUserMinted}`" />
              </div>

              <div v-else>
                <NeoButton
                  ref="root"
                  class="my-2 mint-button"
                  variant="k-accent"
                  :loading="isImageFetching"
                  :disabled="mintButtonDisabled"
                  :label="$t('mint.unlockable.mintThisNft')"
                  @click="handleSubmitMint" />
              </div>
            </div>
          </div>
        </div>
        <div class="column pt-5 is-flex is-justify-content-center">
          <GenerativePreview
            :content="drop.content"
            :image="drop.image"
            @select="handleSelectImage" />
        </div>
      </div>
      <CollectionUnlockableItemInfo :collection-id="collectionId" />
      <div class="my-4">
        <CarouselTypeLatestMints
          :collection-id="collectionId"
          interaction="MINT" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import { NeoButton } from '@kodadot1/brick'
import { createUnlockableMetadata } from '../unlockable/utils'
import GenerativePreview from '@/components/collection/drop/GenerativePreview.vue'
import { DropItem } from '@/params/types'
import { doWaifu } from '@/services/waifu'
import { makeScreenshot } from '@/services/capture'
import { pinFileToIPFS } from '@/services/nftStorage'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps({
  drop: {
    type: Object,
    default: () => {
      return {} as DropItem
    },
  },
})

const collectionId = computed(() => props.drop?.collection)

const { neoModal } = useProgrammatic()
const { $i18n } = useNuxtApp()
const root = ref()

const { toast } = useToast()
const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const selectedImage = ref<string>('')
const { isLogIn } = useAuth()
const justMinted = ref('')
const isLoading = ref(false)
const isImageFetching = ref(false)

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const { data: collectionData } = useGraphql({
  queryName: 'unlockableCollectionById',
  variables: {
    id: collectionId.value,
  },
})

const totalCount = computed(
  () => collectionData.value?.collectionEntity?.max || 200,
)
const totalAvailableMintCount = computed(
  () => totalCount.value - mintedCount.value,
)

watch(accountId, () => {
  refetchCollectionStats({
    account: accountId.value,
  })
})

const {
  data: stats,
  loading: currentMintedLoading,
  refetch: refetchCollectionStats,
} = useGraphql({
  queryName: 'firstNftOwnedByAccountAndCollectionId',
  variables: {
    id: collectionId.value,
    account: accountId.value,
  },
})

const hasUserMinted = computed(
  () => stats.value?.collection.nfts?.at(0)?.id || justMinted.value,
)

useSubscriptionGraphql({
  query: `nftEntities(
    orderBy: id_ASC,
    where: { burned_eq: false, collection: { id_eq: "${collectionId.value}" }, currentOwner_eq: "${accountId.value}" }
    ) {
      id
  }`,
  onChange: refetchCollectionStats,
})

const mintedCount = computed(
  () => collectionData.value?.nftEntitiesConnection?.totalCount || 0,
)

const mintedPercent = computed(() => {
  const percent = (mintedCount.value / totalCount.value) * 100
  return Math.round(percent)
})

const mintCountAvailable = computed(() => mintedCount.value < totalCount.value)

const mintButtonDisabled = computed(() =>
  Boolean(
    currentMintedLoading.value ||
      !mintCountAvailable.value ||
      !selectedImage.value ||
      !accountId.value,
  ),
)

const description = computed(
  () => collectionData.value?.collectionEntity?.meta?.description,
)
const collectionName = computed(
  () => collectionData.value?.collectionEntity?.name,
)

const scrollToTop = () => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  })
}

const handleSubmitMint = async () => {
  if (!isLogIn.value) {
    neoModal.open({
      ...ConnectWalletModalConfig,
    })
    return
  }
  if (isLoading.value || isImageFetching.value) {
    return false
  }

  try {
    isImageFetching.value = true

    const imgFile = await makeScreenshot(sanitizeIpfsUrl(selectedImage.value))
    const imageHash = await pinFileToIPFS(imgFile)

    const hash = await createUnlockableMetadata(
      imageHash,
      description.value,
      collectionName.value,
      'text/html',
      selectedImage.value,
    )

    isImageFetching.value = false

    const { accountId } = useAuth()
    isLoading.value = true

    const id = await doWaifu(
      {
        address: accountId.value,
        metadata: hash,
        image: imageHash,
      },
      props.drop.id,
    ).then((res) => {
      toast('mint success', { duration: 20000 })
      scrollToTop()
      return `${collectionId.value}-${res.result.sn}`
    })

    setTimeout(() => {
      isLoading.value = false
      justMinted.value = id
      toast('You will be redirected in few seconds', { duration: 3000 })
      return navigateTo(`/${urlPrefix.value}/gallery/${id}`)
    }, 44000)
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isLoading.value = false
    isImageFetching.value = false
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.unlockable-container {
  .mint-button {
    width: 14rem;
    height: 3.5rem;
  }
}

.order-1 {
  order: 1;
}
</style>
