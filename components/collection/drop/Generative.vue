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
            <div>{{ $t('mint.unlockable.totalAvailableItem') }}</div>
            <div>{{ totalAvailableMintCount }} / {{ totalCount }}</div>
          </div>
          <UnlockableTag />

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
              class="is-flex is-justify-content-space-between is-align-items-center">
              <div class="title is-size-4">
                <Money :value="pricePerMint" :prefix="drop?.chain" inline />
              </div>
              <div>
                <NeoButton
                  ref="root"
                  class="mb-2 mt-4 mint-button"
                  variant="k-accent"
                  :disabled="mintButtonDisabled"
                  label="Mint"
                  @click="handleMint" />
                <div class="is-flex is-align-items-center mt-2">
                  <NeoIcon icon="timer" class="mr-2" />
                  {{ leftTime }}
                </div>
              </div>
            </div>
          </div>
          <TokenImportButton :price="pricePerMint" />
        </div>
        <div class="column pt-5 is-flex is-justify-content-center">
          <GenerativePreview
            :content="drop.content"
            :image="drop.image"
            @select="handleSelectImage" />
        </div>
      </div>
      <hr class="text-color my-4" />
      <div class="columns is-desktop">
        <div
          class="column is-half-desktop is-flex is-flex-direction-column is-justify-content-center order-1">
          <div
            class="is-flex is-align-items-center has-text-weight-bold is-size-6 mb-2">
            <NeoIcon icon="unlock" class="mr-2" />
            {{ $t('mint.unlockable.howItemWork') }}
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
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import { notificationTypes, showNotification } from '@/utils/notification'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import {
  createUnlockableMetadata,
  generativeTokenMintArgs,
} from '../unlockable/utils'
import GenerativePreview from '@/components/collection/drop/GenerativePreview.vue'
import { useCountDown } from '../unlockable/utils/useCountDown'
import { MINT_ADDRESS, countDownTime } from './const'
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

const collectionId = computed(() => props.drop?.collection)
const pricePerMint = computed(() => props.drop?.meta)

const { neoModal } = useProgrammatic()
const { $i18n } = useNuxtApp()
const root = ref()

const { toast } = useToast()
const { accountId } = useAuth()

const selectedImage = ref<string>('')
const { isLogIn } = useAuth()
const { hours, minutes } = useCountDown(countDownTime)
const justMinted = ref('')
const isLoading = ref(false)

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}
const actionLabel = $i18n.t('nft.event.MINTNFT')

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
    account: accountId.value,
  },
})

const totalCount = computed(
  () => collectionData.value?.collectionEntity?.nftCount || 200,
)
const totalAvailableMintCount = computed(
  () => totalCount.value - mintedCount.value,
)

const refetchData = async () => {
  await tryAgain()
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

const mintedCount = computed(
  () => collectionData.value?.nftEntitiesConnection?.totalCount || 0,
)

const mintedPercent = computed(() => {
  const percent = (mintedCount.value / totalCount.value) * 100
  return Math.round(percent)
})

const mintCountAvailable = computed(() => mintedCount.value < totalCount.value)

const mintButtonDisabled = computed(() =>
  Boolean(!mintCountAvailable.value || !selectedImage.value),
)

const handleMint = async () => {
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
    $i18n.t('nft.notification.info', {
      itemId: collectionName.value,
      action: actionLabel,
    }),
  )

  handleSubmitMint()
}

const description = computed(
  () => collectionData.value?.collectionEntity?.meta?.description,
)
const collectionName = computed(
  () => collectionData.value?.collectionEntity?.name,
)

const { howAboutToExecute, initTransactionLoader } = useMetaTransaction()

const { apiInstance } = useApi()

const handleSubmitMint = async () => {
  const api = await apiInstance.value

  if (!selectedImage.value) {
    toast('no image')
    return
  }

  const hash = await createUnlockableMetadata(
    selectedImage.value,
    description.value,
    collectionName.value,
    'text/html',
  )

  const args = await generativeTokenMintArgs(
    collectionData.value?.collectionEntity?.id,
    mintedCount.value,
    hash,
    api,
  )

  initTransactionLoader()
  const cb = api.tx.utility.batchAll
  await howAboutToExecute(accountId.value, cb, [args], (blockNumber) => {
    const msg = 'your nft has been minted'
    showNotification(
      `[MINT] Since block ${blockNumber} ${msg}`,
      notificationTypes.success,
    )
  })
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
