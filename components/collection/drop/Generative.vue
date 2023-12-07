<template>
  <div class="unlockable-container">
    <CollectionUnlockableLoader
      v-if="isLoading"
      :duration="MINTING_SECOND"
      :minted="justMinted"
      model-value
      @model-value="isLoading = false" />
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
            <div>{{ totalAvailableMintCount }} / {{ maxCount }}</div>
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
                {{ mintedCount }} / {{ maxCount }}
                {{ $t('statsOverview.minted') }}
              </div>
            </div>
          </div>
          <div class="my-5">
            <UnlockableSlider :value="mintedCount / maxCount" />
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
                  :loading="isImageFetching || isWalletConnecting"
                  :disabled="mintButtonDisabled"
                  :loading-with-label="isWalletConnecting"
                  :label="
                    $t(
                      isWalletConnecting
                        ? 'shoppingCart.wallet'
                        : 'mint.unlockable.mintThisNft',
                    )
                  "
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

  <CollectionDropConfirmModal
    v-model="isConfirmModalActive"
    @confirm="handleConfirmMint"
    @close="closeConfirmModal" />
</template>

<script setup lang="ts">
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { createUnlockableMetadata } from '../unlockable/utils'
import GenerativePreview from '@/components/collection/drop/GenerativePreview.vue'
import { DropItem } from '@/params/types'
import { doWaifu } from '@/services/waifu'
import { useDropStatus } from '@/components/drops/useDrops'
import { makeScreenshot } from '@/services/capture'
import { pinFileToIPFS } from '@/services/nftStorage'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import newsletterApi from '@/utils/newsletter'

const NuxtLink = resolveComponent('NuxtLink')
const MINTING_SECOND = 120

const props = defineProps({
  drop: {
    type: Object,
    default: () => {
      return {} as DropItem
    },
  },
})
const isWalletConnecting = ref(false)
const collectionId = computed(() => props.drop?.collection)
const disabledByBackend = computed(() => props.drop?.disabled)
const defaultImage = computed(() => props.drop?.image)
const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
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
const isConfirmModalActive = ref(false)

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const { data: collectionData } = useGraphql({
  queryName: 'unlockableCollectionById',
  variables: {
    id: collectionId.value,
  },
})

const maxCount = computed(
  () => collectionData.value?.collectionEntity?.max || 200,
)
const totalAvailableMintCount = computed(
  () => maxCount.value - mintedCount.value,
)

const hasUserMinted = computed(() =>
  currentAccountMintedToken.value
    ? `${collectionId.value}-${currentAccountMintedToken.value.id}`
    : justMinted.value,
)

const mintedCount = computed(() =>
  Math.min(mintedDropCount.value, maxCount.value),
)

const mintedPercent = computed(() => {
  const percent = (mintedCount.value / maxCount.value) * 100
  return Math.round(percent)
})

const mintCountAvailable = computed(() => mintedCount.value < maxCount.value)

const mintButtonDisabled = computed(
  () =>
    isLogIn.value &&
    Boolean(
      !mintCountAvailable.value ||
        !selectedImage.value ||
        disabledByBackend.value,
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

const tryCapture = async () => {
  try {
    const imgFile = await makeScreenshot(sanitizeIpfsUrl(selectedImage.value))
    const imageHash = await pinFileToIPFS(imgFile)
    return imageHash
  } catch (error) {
    toast($i18n.t('drops.capture'))
    return defaultImage.value
  }
}

const clearWalletConnecting = () => {
  isWalletConnecting.value = false
}

const handleSubmitMint = async () => {
  if (!isLogIn.value) {
    isWalletConnecting.value = true
    doAfterLogin({
      onLoginSuccess: clearWalletConnecting,
      onCancel: clearWalletConnecting,
    })

    return
  }
  if (isLoading.value || isImageFetching.value) {
    return false
  }

  openConfirmModal()
}

const closeConfirmModal = () => {
  isConfirmModalActive.value = false
}

const openConfirmModal = () => {
  isConfirmModalActive.value = true
}

const subscribe = async (email: string) => {
  try {
    await newsletterApi.subscribe(email)
  } catch (error) {
    dangerMessage($i18n.t('signupBanner.failed'))
    throw error
  }
}

const submitMint = async (email: string) => {
  try {
    isImageFetching.value = true
    isLoading.value = true

    const imageHash = await tryCapture()

    const hash = await createUnlockableMetadata(
      imageHash,
      description.value,
      collectionName.value,
      'text/html',
      selectedImage.value,
    )

    isImageFetching.value = false

    const id = await doWaifu(
      {
        address: accountId.value,
        metadata: hash,
        image: imageHash,
        email,
      },
      props.drop.id,
    ).then((res) => {
      toast('mint success', { duration: 20000 })
      scrollToTop()
      return `${collectionId.value}-${res.result.sn}`
    })

    fetchDropStatus()

    setTimeout(() => {
      isLoading.value = false
      justMinted.value = id
      toast('You will be redirected in few seconds', { duration: 3000 })
      return navigateTo(`/${urlPrefix.value}/gallery/${id}`)
    }, MINTING_SECOND * 1000)
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isLoading.value = false
    isImageFetching.value = false
  }
}

const handleConfirmMint = async ({ email }) => {
  try {
    closeConfirmModal()
    isLoading.value = true
    await subscribe(email)
    await submitMint(email)
  } catch (error) {
    isLoading.value = false
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
