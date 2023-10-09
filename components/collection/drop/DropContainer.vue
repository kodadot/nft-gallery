<template>
  <div class="unlockable-container">
    <Loader v-model="isLoading" :minted="justMinted" />
    <CountdownTimer />
    <hr class="text-color my-0" />
    <div class="container is-fluid">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <UnlockableCollectionInfo
            :collection-id="collectionId"
            :description="description" />
          <hr class="mb-4" />

          <div
            class="is-flex is-justify-content-space-between is-align-items-center my-5">
            <div>Total available items</div>
            <div>{{ totalAvailableMintCount }} / {{ totalCount }}</div>
          </div>
          <UnlockableTag />

          <div>
            <div
              class="is-flex is-justify-content-space-between is-align-items-center my-5">
              <div class="has-text-weight-bold is-size-5">Mint Phase</div>
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
                {{ mintedCount }} / {{ totalCount }} Minted
              </div>
            </div>
          </div>
          <div class="my-5">
            <UnlockableSlider :value="mintedCount / totalCount" />
          </div>
          <div class="my-5">
            <div
              class="is-flex is-justify-content-space-between is-align-items-center">
              <div class="title is-size-4">
                <Money :value="displayPricePerMint" inline />
              </div>
              <div>
                <NeoButton
                  ref="root"
                  class="mb-2 mt-4 mint-button"
                  variant="k-accent"
                  :disabled="mintButtonDisabled"
                  label="Mint"
                  @click="handleBuy" />
                <div class="is-flex is-align-items-center mt-2">
                  <svg
                    width="20"
                    height="21"
                    class="mr-2"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 2.73016C14.4062 2.73016 18 6.32391 18 10.7302C18 15.1677 14.4062 18.7302 10 18.7302C5.5625 18.7302 2 15.1677 2 10.7302C2 9.07391 2.5 7.54266 3.375 6.26141L3.78125 5.63641L5.03125 6.48016L4.59375 7.10516C3.90625 8.13641 3.5 9.38641 3.5 10.7302C3.5 14.3239 6.40625 17.2302 10 17.2302C13.5625 17.2302 16.5 14.3239 16.5 10.7302C16.5 7.41766 13.9688 4.66766 10.75 4.29266V5.98016V6.73016H9.25V5.98016V3.48016V2.73016H10ZM8.03125 7.69891H8L10.5 10.1989L11.0312 10.7302L10 11.7927L9.46875 11.2614L6.96875 8.76141L6.4375 8.23016L7.5 7.16766L8.03125 7.69891Z"
                      fill="currentColor" />
                  </svg>
                  {{ leftTime }}
                </div>
              </div>
            </div>
          </div>
          <TokenImportButton />
        </div>
        <div class="column pt-5 is-flex is-justify-content-center">
          <ImageSlider v-if="imageList.length" :image-list="imageList" />
        </div>
      </div>
      <hr class="text-color my-4" />
      <div class="columns is-desktop">
        <div
          class="column is-half-desktop is-flex is-flex-direction-column is-justify-content-center order-1">
          <div
            class="is-flex is-align-items-center has-text-weight-bold is-size-6 mb-2">
            <svg
              class="mr-2"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 6.65137V8.65137H15.5H17V10.1514V17.1514V18.6514H15.5H4.5H3V17.1514V10.1514V8.65137H4.5H6V6.65137C6 4.46387 7.78125 2.65137 10 2.65137C11.7812 2.65137 13.2812 3.83887 13.7812 5.43262L12.375 5.90137C12.0312 4.90137 11.0938 4.15137 10 4.15137C8.59375 4.15137 7.5 5.27637 7.5 6.65137ZM4.5 17.1514H15.5V10.1514H4.5V17.1514Z"
                fill="currentColor" />
            </svg>
            How unlockable item works
          </div>
          <div>
            Experience the excitement of unlocking hidden rewards! Get your
            hands on exclusive merchandise (and an NFT!) linked to unlockable
            content. For the next ten hours, the fastest ten individuals can
            mint their very own anime waifu character NFT for free. Simply log
            in with your wallet, click on the "Mint" button, and sign the
            transaction. Afterward, check your profile to find the NFT and click
            "Unlockable Content" to reveal the surprise. Follow the schedule so
            you don't miss this!
          </div>
          <NeoButton
            tag="a"
            href="https://hello.kodadot.xyz/fandom-toolbox/audience-growth/unlockables"
            target="_blank"
            variant="secondary"
            class="mt-2">
            Learn More
          </NeoButton>
        </div>
        <div class="column">
          <img src="/unlockable-introduce.svg" alt="Unlockable" />
        </div>
      </div>
      <div class="my-4">
        <CarouselTypeLatestMints
          :collection-id="collectionId"
          interaction="BUY" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountdownTimer from '@/components/collection/unlockable/CountdownTimer.vue'
import ImageSlider from '@/components/collection/unlockable/ImageSlider.vue'
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import { tokenIdToRoute } from '@/components/unique/utils'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import { claimDropItem, getLatestWaifuImages } from '@/services/waifu'
import {
  notificationTypes,
  showNotification,
  warningMessage,
} from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'
import { NeoButton } from '@kodadot1/brick'
import {
  createUnlockableMetadata,
  getRandomInt,
  unlockableDesc,
} from '../unlockable/utils'
import { useCountDown } from '../unlockable/utils/useCountDown'
import { MINT_ADDRESS, countDownTime, displayPricePerMint } from './const'
import { DropItem } from '@/params/types'

const Loader = defineAsyncComponent(
  () => import('@/components/collection/unlockable/UnlockableLoader.vue'),
)

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue'),
)

const TokenImportButton = defineAsyncComponent(
  () => import('@/components/collection/drop/TokenImportButton.vue'),
)

const props = defineProps({
  drop: {
    type: Object,
    default: () => {
      return {} as DropItem
    },
  },
})

const collectionId = computed(() => props.drop?.collectionId)
const pricePerMint = computed(() => props.drop?.meta)

const { neoModal } = useProgrammatic()
const { $i18n } = useNuxtApp()
const root = ref()

const { toast } = useToast()

const imageList = ref<string[]>([])
const resultList = ref<any[]>([])
const { urlPrefix } = usePrefix()
const { isLogIn } = useAuth()
const { hours, minutes } = useCountDown(countDownTime)
const justMinted = ref('')
const isLoading = ref(false)

const actionLabel = $i18n.t('nft.action.buy')

onMounted(async () => {
  const res = await getLatestWaifuImages()
  imageList.value = res.result.map((item) => item.output)
  resultList.value = res.result
})

const leftTime = computed(() => {
  const hoursLeft = hours.value > 0 ? `${hours.value} Hour ` : ''
  const minutesLeft = minutes.value > 0 ? `${minutes.value} Minute ` : ''
  const isFinish = !hoursLeft && !minutesLeft
  return isFinish ? 'Finished' : `${hoursLeft}${minutesLeft}Left`
})

const { data: collectionData, refetch: tryAgain } = useGraphql({
  queryName: 'dropCollectionById',
  variables: {
    id: collectionId.value,
    price: pricePerMint.value,
    account: MINT_ADDRESS,
  },
})

const totalCount = computed(
  () => collectionData.value?.collectionEntity?.nftCount || 200,
)
const totalAvailableMintCount = computed(
  () => collectionData.value?.nftEntitiesConnection?.totalCount,
)

const { data, refetch } = useGraphql({
  queryName: 'nftIdListByCollection',
  variables: {
    id: collectionId.value,
    search: [
      { price_eq: pricePerMint.value },
      { currentOwner_eq: MINT_ADDRESS },
    ],
  },
})

const refetchData = async () => {
  await tryAgain()
  await refetch()
}

useSubscriptionGraphql({
  query: `nftEntities(
    orderBy: id_ASC,
    where: { burned_eq: false, collection: { id_eq: "${collectionId.value}" }, price_eq: "${pricePerMint.value}", currentOwner_eq: "${MINT_ADDRESS}" }
    ) {
      id
  }`,
  onChange: refetchData,
})

const toBuy = computed<string[]>(() => {
  return data.value?.nfts?.map((x) => x.id)
})

const mintedCount = computed(
  () => totalCount.value - totalAvailableMintCount.value,
)

const mintedPercent = computed(() => {
  const percent = (mintedCount.value / totalCount.value) * 100
  return Math.round(percent)
})

const mintCountAvailable = computed(() => mintedCount.value < totalCount.value)

const mintButtonDisabled = computed(() => Boolean(!mintCountAvailable.value))

const scrollToTop = () => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  })
}

const handleBuy = async () => {
  const randomToken = getRandomInt(toBuy.value.length - 1)
  const tokenId = toBuy.value.at(randomToken)

  if (!tokenId) {
    warningMessage('UNABLE TO MINT WITHOUT')
    return
  }

  if (!isLogIn.value) {
    neoModal.open({
      ...ConnectWalletModalConfig,
    })
    return
  }

  if (isLoading.value) {
    return false
  }
  isLoading.value = true

  showNotification(
    $i18n.t('nft.notification.info', { itemId: 'Waifu', action: actionLabel }),
  )

  const { transaction, blockNumber } = useTransaction()

  try {
    watch(blockNumber, async (block) => {
      if (block) {
        showNotification(`[${actionLabel}] Waifu`, notificationTypes.success)
        await handleSubmitMint(tokenId)
      }
    })

    await transaction({
      interaction: ShoppingActions.BUY,
      currentOwner: MINT_ADDRESS,
      price: pricePerMint.value,
      nftId: tokenId,
      tokenId: tokenId,
      urlPrefix: urlPrefix.value,
      successMessage: $i18n.t('mint.successNewNfts'),
      errorMessage: $i18n.t('transaction.buy.error'),
    })
  } catch (error) {
    warningMessage(error)
  }
}

const description = unlockableDesc(50)

const handleSubmitMint = async (tokenId: string) => {
  const randomIndex = getRandomInt(imageList.value.length - 1)
  const image = resultList.value.at(randomIndex).image

  if (!image || !tokenId) {
    toast('no image')
    return
  }

  const hash = await createUnlockableMetadata(image, description)

  const { item: sn } = tokenIdToRoute(tokenId)

  try {
    await claimDropItem(
      {
        metadata: hash,
        sn,
      },
      props.drop.id,
    ).then((res) => {
      toast('mint success')
      justMinted.value = `${collectionId.value}-${res.result.sn}`
      scrollToTop()
    })
  } catch (error) {
    toast('failed to mint')
  } finally {
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
