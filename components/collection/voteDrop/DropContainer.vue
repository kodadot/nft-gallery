<template>
  <div class="unlockable-container">
    <CollectionUnlockableLoader
      v-if="isLoading"
      model-value
      :minted="justMinted"
      @model-value="isLoading = false" />
    <CountdownTimer />
    <hr class="text-color my-0" />
    <div class="container is-fluid pb-4">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <UnlockableCollectionInfo
            :collection-id="collectionId"
            :description="VOTE_DROP_DESCRIPTION" />
          <hr class="mb-4" />

          <UnlockableTag :collection-id="collectionId" />

          <div>
            <div class="flex justify-between items-center my-5">
              <div class="font-bold is-size-5">
                {{ $t('mint.unlockable.phase') }}
              </div>
              <span v-if="mintCountAvailable" class="flex items-center">
                <img src="/unlockable-pulse.svg" alt="open" />
                {{ $t('mint.unlockable.open') }}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span>{{ mintedPercent }} %</span
              ><span class="font-bold">
                {{ mintedCount }} / {{ totalCount }}
                {{ $t('statsOverview.minted') }}</span
              >
            </div>
          </div>
          <div class="my-5">
            <UnlockableSlider :value="mintedCount / totalCount" />
          </div>
          <div class="my-5">
            <div v-if="!userMintedId" class="flex justify-between">
              <div class="flex items-center">
                <NeoIcon
                  :icon="statusInformation.icon"
                  class="mr-2"
                  :class="statusInformation.iconClass"
                  :pack="statusInformation.iconPack" />
                <span :class="statusInformation.labelClass">{{
                  statusInformation.label
                }}</span>
              </div>
              <div>
                <NeoButton
                  class="mb-2 mt-4 mint-button"
                  variant="k-accent"
                  :disabled="mintButtonDisabled"
                  :label="buttonLabel"
                  @click="handleMint" />
                <div class="flex items-center mt-2">
                  <NeoIcon icon="timer" class="mr-2" />
                  {{ leftTime }}
                </div>
              </div>
            </div>
            <nuxt-link v-else :to="`/${urlPrefix}/gallery/${userMintedId}`">
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
            :title="$t('mint.unlockable.onlyOneExample')" />
        </div>
      </div>
      <CollectionUnlockableItemInfo :collection-id="collectionId" />
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
import { doWaifu } from '@/services/waifu'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { useCountDown } from '../unlockable/utils/useCountDown'
import { VOTE_DROP_DESCRIPTION, countDownTime } from './const'
import { useDropStatus } from '@/components/drops/useDrops'
import { DropItem } from '@/params/types'

import { useCheckReferenDumVote } from '@/composables/drop/useCheckReferenDumVote'

const props = defineProps({
  drop: {
    type: Object,
    default: () => {
      return {} as DropItem
    },
  },
})
const { $i18n } = useNuxtApp()
const { neoModal } = useProgrammatic()
const { accountId } = useAuth()
const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const collectionId = computed(() => props.drop?.collection)

const imageList = ref<string[]>([])
const { urlPrefix } = usePrefix()
const { isLogIn } = useAuth()
const { hours, minutes } = useCountDown({ countDownTime })
const justMinted = ref('')
const isLoading = ref(false)

const { toast } = useToast()

const { isEligibleUser } = useCheckReferenDumVote(props.drop?.meta)

const needCheckEligible = computed(() => {
  return !isLogIn.value
})

const buttonLabel = computed(() => {
  return needCheckEligible.value
    ? 'Check Eligibility'
    : isEligibleUser.value
      ? 'Mint'
      : 'Not Eligible'
})

const statusInformation = computed(() => {
  return needCheckEligible.value
    ? {
        label: $i18n.t('mint.unlockable.ayeVotersOnly'),
        icon: 'circle-info',
        iconClass: 'text-k-grey',
        labelClass: 'text-k-grey',
        iconPack: 'fasr',
      }
    : isEligibleUser.value
      ? {
          label: $i18n.t('mint.unlockable.eligible'),
          icon: 'circle-check',
          iconPack: 'fasr',
          iconClass: 'text-k-green',
        }
      : {
          label: $i18n.t('mint.unlockable.exclusive'),
          icon: 'circle-info',
          iconClass: 'text-k-grey',
          labelClass: 'text-k-grey',
          iconPack: 'fasr',
        }
})

const leftTime = computed(() => {
  const hoursLeft = hours.value > 0 ? `${hours.value} Hour ` : ''
  const minutesLeft = minutes.value > 0 ? `${minutes.value} Minute ` : ''
  const isFinish = !hoursLeft && !minutesLeft
  return isFinish ? 'Finished' : `${hoursLeft}${minutesLeft}Left`
})

const { data: collectionData } = useGraphql({
  queryName: 'dropCollectionById',
  variables: {
    id: collectionId.value,
    account: accountId.value,
  },
})

watch(collectionData, () => {
  if (collectionData.value) {
    imageList.value = [
      sanitizeIpfsUrl(collectionData.value?.collectionEntity.image),
    ]
  }
})

const totalCount = 300

const totalAvailableMintCount = computed(
  () => totalCount - Math.min(mintedDropCount.value, totalCount),
)

const mintedCount = computed(() => totalCount - totalAvailableMintCount.value)

const mintedPercent = computed(() => {
  const percent = (mintedCount.value / totalCount) * 100
  return Math.round(percent)
})

const userMintedId = computed(
  () =>
    Boolean(accountId.value) &&
    (currentAccountMintedToken.value
      ? `${collectionId.value}-${currentAccountMintedToken.value.id}`
      : justMinted.value),
)

const mintCountAvailable = computed(() => mintedCount.value < totalCount)

watch(accountId, () => {
  justMinted.value = ''
})

const mintButtonDisabled = computed(
  () =>
    Boolean(
      !mintCountAvailable.value || !isEligibleUser.value || userMintedId.value,
    ) && !needCheckEligible.value,
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

  const { accountId } = useAuth()

  try {
    const id = await doWaifu(
      {
        address: accountId.value,
        metadata: collectionData.value.collectionEntity.metadata,
        image: collectionData.value.collectionEntity.image,
      },
      props.drop?.id,
    ).then((res) => {
      toast('mint success')
      return `${collectionId.value}-${res.result.sn}`
    })

    fetchDropStatus()
    // 40s timeout
    setTimeout(() => {
      isLoading.value = false
      justMinted.value = id
      toast('You will be redirected in few seconds')
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
