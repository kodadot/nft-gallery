<template>
  <div class="unlockable-container">
    <Loader v-model="isLoading" :status="status" />
    <CountdownTimer />
    <hr class="text-color my-0" />
    <div class="container is-fluid">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <UnlockableCollectionInfo />
          <hr class="mb-4" />

          <div
            class="is-flex is-justify-content-space-between is-align-items-center my-5">
            <span class="">Total available items</span>
            <span class=""
              >{{ totalAvailableMintCount }} / {{ totalCount }}</span
            >
          </div>
          <UnlockableTag />

          <div>
            <div
              class="is-flex is-justify-content-space-between is-align-items-center my-5">
              <span class="has-text-weight-bold is-size-5">First Phase</span
              ><span
                v-if="!mintButtonDisabled"
                class="is-flex is-align-items-center"
                ><svg
                  width="42"
                  height="43"
                  viewBox="0 0 42 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <circle cx="21" cy="21.2302" r="6" fill="#FF7AC3" />
                  <g filter="url(#filter0_f_394_6126)">
                    <circle cx="21" cy="21.7302" r="6" fill="#FF7AC3" />
                  </g>
                  <defs>
                    <filter
                      id="filter0_f_394_6126"
                      x="0"
                      y="0.730164"
                      width="42"
                      height="42"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape" />
                      <feGaussianBlur
                        stdDeviation="7.5"
                        result="effect1_foregroundBlur_394_6126" />
                    </filter>
                  </defs>
                </svg>
                Open</span
              >
            </div>
            <div
              class="is-flex is-justify-content-space-between is-align-items-center">
              <span>Free</span
              ><span class="has-text-weight-bold">
                {{ currentMintedCount }} / {{ MAX_PER_WINDOW }} Minted</span
              >
            </div>
          </div>
          <div class="my-5">
            <o-slider :value="currentMintedCount * 10" disabled></o-slider>
          </div>
          <div class="my-5">
            <NeoButton
              class="mb-2 mt-4 mint-button"
              variant="k-accent"
              :disabled="mintButtonDisabled || !isLogIn || hasUserMinted"
              label="Mint"
              @click.native="handleSubmitMint" />
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
              {{ timeFromNow }}
            </div>
          </div>

          <div class="my-5">
            <span class="has-text-weight-bold is-size-5">Schedule</span>
          </div>
          <div>
            <span
              >We will have a 10-minute window every hour, each featuring only
              10 exclusive items.</span
            >
          </div>
          <!-- <UnlockableSchedule /> -->
        </div>
        <div class="column pt-5 is-flex is-justify-content-center">
          <ImageSlider
            v-if="imageList.length"
            :image-list="imageList"
            @select="handleSelectImage" />
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
          <a
            href="https://hello.kodadot.xyz/fandom-toolbox/audience-growth/unlockables"
            target="_blank">
            <NeoButton variant="unlockable" class="mt-2">
              Learn More
            </NeoButton>
          </a>
        </div>
        <div class="column">
          <img :src="unloackableBanner" alt="Unlockable" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UnlockableCollectionInfo from '~~/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import CountdownTimer from '@/components/collection/unlockable/CountdownTimer.vue'
import { NeoButton } from '@kodadot1/brick'
import ImageSlider from '@/components/collection/unlockable/ImageSlider.vue'
// import UnlockableSchedule from '@/components/collection/unlockable/UnlockableSchedule.vue'
import unloackableBanner from '@/assets/unlockable-introduce.svg'
import { doWaifu, getLatestWaifuImages } from '@/services/waifu'
import { OSlider } from '@oruga-ui/oruga'
import { timeAgo } from '@/components/collection/utils/timeAgo'
import { collectionId, countDownTime } from './const'
import { UNLOCKABLE_CAMPAIGN, createUnlockableMetadata } from './utils'
import { endOfHour, startOfHour } from 'date-fns'
const { toast } = useToast()

const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue')
)

const imageList = ref<string[]>([])
const resultList = ref<any[]>([])
const selectedImage = ref('')
const MAX_PER_WINDOW = 10
const { urlPrefix } = usePrefix()
const isLoading = ref(false)
const status = ref('')
const { accountId, isLogIn } = useAuth()

onMounted(async () => {
  const res = await getLatestWaifuImages()
  imageList.value = res.result.map((item) => item.output)
  resultList.value = res.result
})

const now = new Date()
const windowRange = [startOfHour(now), endOfHour(now)]

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const { data: collectionData } = useGraphql({
  queryName: 'unlockableCollectionById',
  variables: {
    id: collectionId,
  },
})

const { data: counts } = useGraphql({
  queryName: 'nftOwnedCountByCollectionId',
  variables: {
    id: collectionId,
    account: accountId.value,
  },
})

const hasUserMinted = computed(() => counts.value?.nft?.count > 0)

const totalCount = computed(() => collectionData.value?.max || 300)
const totalAvailableMintCount = computed(
  () =>
    totalCount.value -
    (collectionData.value?.nftEntitiesConnection?.totalCount || 0)
)

const { data, refetch } = useGraphql({
  queryName: 'collectionMintedBetween',
  clientName: urlPrefix.value,
  variables: {
    id: collectionId,
    from: windowRange[0],
    to: windowRange[1],
  },
})

useSubscriptionGraphql({
  query: `collectionEntityById(id: "${collectionId}") {
    nftCount
  }`,
  onChange: refetch,
})

const mintedCount = computed(() => data.value?.minted?.count || 0)

const currentMintedCount = computed(() =>
  Math.min(mintedCount.value, MAX_PER_WINDOW)
)

const mintButtonDisabled = computed(
  () => currentMintedCount.value >= MAX_PER_WINDOW
)
const timeFromNow = computed(() => timeAgo(countDownTime))

const handleSubmitMint = async () => {
  if (isLoading.value) {
    return false
  }
  isLoading.value = true

  const image =
    resultList.value.find((item) => item.output === selectedImage.value)
      ?.image || resultList.value[0]?.image

  const hash = await createUnlockableMetadata(image)

  const { accountId } = useAuth()
  await doWaifu(
    {
      address: accountId.value,
      metadata: hash,
      image: image,
    },
    UNLOCKABLE_CAMPAIGN
  )
    .catch(() => {
      toast('failed to mint')
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

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
