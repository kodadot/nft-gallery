<template>
  <div class="unlockable-container">
    <CollectionUnlockableLoader
      v-if="isLoading"
      model-value
      :minted="justMinted"
      @model-value="isLoading = false" />
    <CountdownTimer />
    <hr class="text-color my-0" />
    <div class="container is-fluid">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <UnlockableCollectionInfo
            :collection-id="collectionId"
            :description="description" />
          <hr class="mb-4" />

          <UnlockableTag :collection-id="collectionId" />

          <div>
            <div class="flex justify-between items-center my-5">
              <span class="font-bold text-xl">First Phase</span
              ><span v-if="mintCountAvailable" class="flex items-center">
                <span class="relative flex h-3 w-3 mr-2">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-k-primary opacity-75"></span>
                  <span
                    class="relative inline-flex rounded-full h-3 w-3 bg-k-primary"></span>
                </span>
                Open</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span>Free</span
              ><span class="font-bold">
                {{ currentMintedCount }} / {{ MAX_PER_WINDOW }} Minted</span
              >
            </div>
          </div>
          <div class="my-5">
            <UnlockableSlider :value="currentMintedCount / MAX_PER_WINDOW" />
          </div>
          <div v-if="!currentMintedLoading" class="my-5">
            <template v-if="!hasUserMinted">
              <NeoButton
                ref="root"
                class="mb-2 mt-4 mint-button"
                variant="k-accent"
                :disabled="mintButtonDisabled"
                label="Mint"
                @click="handleSubmitMint" />
              <div class="flex items-center mt-2">
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
            </template>
            <nuxt-link v-else :to="`/${urlPrefix}/gallery/${hasUserMinted}`">
              <p class="title text-2xl">
                [{{ $t('mint.unlockable.alreadyMinted') }}]
              </p>
            </nuxt-link>
          </div>
        </div>
        <div class="column pt-5 flex justify-center">
          <ImageSlider
            v-if="imageList.length"
            :image-list="imageList"
            @select="handleSelectImage" />
        </div>
      </div>
      <CollectionUnlockableItemInfo :collection-id="collectionId" />

      <div class="my-4">
        <CarouselTypeLatestMints
          :collection-id="collectionId"
          interaction="SEND" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import CountdownTimer from '@/components/collection/unlockable/CountdownTimer.vue'
import ImageSlider from '@/components/collection/unlockable/ImageSlider.vue'
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import { doWaifu, getLatestWaifuImages } from '@/services/waifu'
import { DISPLAY_SLIDE_IMAGE_COUNT, countDownTime } from './const'
import { createUnlockableMetadata, getRandomInt, unlockableDesc } from './utils'
import { endOfHour, startOfHour } from 'date-fns'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import { NeoButton } from '@kodadot1/brick'
import { useCountDown } from './utils/useCountDown'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import { DropItem } from '@/params/types'
import { useDropStatus } from '@/components/drops/useDrops'

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
const { toast } = useToast()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const imageList = ref<string[]>([])
const resultList = ref<any[]>([])
const selectedImage = ref('')
const MAX_PER_WINDOW = 10

const isLoading = ref(false)
const { isLogIn } = useAuth()
const { hours, minutes, seconds } = useCountDown({ countDownTime })
const justMinted = ref('')
const { currentAccountMintedToken, fetchDropStatus } = useDropStatus(
  props.drop.alias,
)

onMounted(async () => {
  const res = await getLatestWaifuImages()
  imageList.value = res.result
    .slice(0, DISPLAY_SLIDE_IMAGE_COUNT)
    .map((item) => item.output)
  resultList.value = res.result
})

const leftTime = computed(() => {
  const hoursLeft = hours.value > 0 ? `${hours.value} Hour ` : ''
  const minutesLeft = minutes.value > 0 ? `${minutes.value} Minute ` : ''
  const secondsLeft = seconds.value > 0 ? `${seconds.value} Sec ` : ''
  const isFinish = !hoursLeft && !minutesLeft && !secondsLeft
  return isFinish ? 'Finished' : `${hoursLeft}${minutesLeft}${secondsLeft}Left`
})

const now = new Date()
const windowRange = [startOfHour(now), endOfHour(now)]

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const hasUserMinted = computed(() =>
  currentAccountMintedToken.value
    ? `${collectionId.value}-${currentAccountMintedToken.value.id}`
    : justMinted.value,
)

const { data, refetch } = useGraphql({
  queryName: 'collectionMintedBetween',
  variables: {
    id: collectionId.value,
    from: windowRange[0],
    to: windowRange[1],
  },
})

const refetchData = async () => {
  await refetch()
}

useSubscriptionGraphql({
  query: `collectionEntityById(id: "${collectionId.value}") {
    nftCount
  }`,
  onChange: refetchData,
})

const mintedCount = computed(() => data.value?.minted?.count || 0)

const currentMintedCount = computed(() =>
  Math.min(mintedCount.value, MAX_PER_WINDOW),
)

const mintCountAvailable = computed(
  () => currentMintedCount.value < MAX_PER_WINDOW,
)

const mintButtonDisabled = computed(() =>
  Boolean(!mintCountAvailable.value || hasUserMinted.value),
)

const scrollToTop = () => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  })
}

const description = unlockableDesc(40)

const handleSubmitMint = async () => {
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

  const randomIndex = getRandomInt(imageList.value.length - 1)
  const image = resultList.value.at(randomIndex).image

  const hash = await createUnlockableMetadata(image, description)

  const { accountId } = useAuth()

  try {
    const id = await doWaifu(
      {
        address: accountId.value,
        metadata: hash,
        image: image,
      },
      props.drop.id,
    ).then((res) => {
      toast('mint success', { duration: 20000 })
      scrollToTop()
      return `${collectionId.value}-${res.result.sn}`
    })
    fetchDropStatus()
    // 40s timeout
    setTimeout(() => {
      isLoading.value = false
      justMinted.value = id
      toast('You will be redirected in few seconds', { duration: 3000 })
      return navigateTo(`/${urlPrefix.value}/gallery/${id}`)
    }, 44000)
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
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
