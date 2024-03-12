<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <div
          v-if="isFetchingDropStatus"
          class="mr-[20px] animate-pulse rounded-full h-[52px] w-[52px] bg-k-shade" />
        <div
          v-else
          class="rounded-full border h-[52px] w-[52px] flex items-center justify-center mr-[20px]"
          :class="{
            'bg-background-color-inverse': currentPhase.iconColorInverse,
          }">
          <NeoIcon
            :icon="currentPhase.icon"
            size="medium"
            :class="{
              'text-text-color-inverse': currentPhase.iconColorInverse,
            }" />
        </div>
        <div class="flex flex-col justify-between self-stretch">
          <div class="font-bold is-size-5 leading-tight">
            {{ currentPhase.title }}
          </div>
          <div
            v-if="isFetchingDropStatus"
            class="animate-pulse rounded h-[14px] w-[80px] bg-k-shade" />
          <div
            v-else-if="dropStatus === DropStatus.SCHEDULED_SOON"
            class="text-neutral-7 leading-tight">
            {{ $t('opensIn') }}
            <span class="text-text-color">{{ statusText }}</span>
          </div>
          <div v-else class="text-neutral-7 leading-tight">
            {{ statusText }}
          </div>
        </div>
      </div>

      <div
        v-if="isFetchingDropStatus"
        class="animate-pulse rounded h-[16px] w-[60px] bg-k-shade" />
      <div
        v-else-if="dropStatus === DropStatus.MINTING_LIVE"
        class="flex items-center">
        <span class="relative flex h-3 w-3 mr-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-k-primary opacity-75"></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-k-primary"></span>
        </span>
        {{ $t('mint.unlockable.open') }}
      </div>
      <div v-else-if="scheduledStatuses.includes(dropStatus!)">
        <span
          class="w-[52px] h-[40px] inline-flex justify-center items-center rounded-3xl cursor-pointer border-neutral-5 dark:border-neutral-9 border hover:border-border-color text-k-grey hover:text-text-color"
          @click="isCreateEventModalActive = true">
          <NeoIcon icon="calendar" />
        </span>
      </div>
      <div
        v-else-if="
          dropStatus === DropStatus.MINTING_ENDED && showHolderOfCollection
        "
        class="w-[28px] -mr-0.5 flex justify-center items-center cursor-pointer text-k-grey hover:text-text-color"
        @click="showRequirements = !showRequirements">
        <NeoIcon
          custom-size="text-lg"
          :icon="showRequirements ? 'chevron-up' : 'chevron-down'" />
      </div>
    </div>

    <CollectionDropRequirementPrivateMintRequirements
      v-if="showHolderOfCollection"
      :class="{ hidden: !showRequirements || isFetchingDropStatus }"
      :holder-of-collection="holderOfCollection"
      :minimum-funds="minimumFunds"
      :is-minted-out="isMintedOut" />

    <DropsCreateCalendarEventModal v-model="isCreateEventModalActive" />

    <!-- if there is location on the campaign -->
    <CollectionDropRequirementItem
      v-if="drop.location"
      :fulfilled="Boolean(drop.userAccess)">
      <p class="capitalize">
        Location Verification: You are
        <span v-if="!Boolean(drop.userAccess)" class="font-bold">not</span> in
        <span class="font-bold">{{ drop.location }}</span>
      </p>
    </CollectionDropRequirementItem>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { DropStatus } from '@/components/drops/useDrops'
import {
  formatDropStartTime,
  toDropScheduledDurationString,
} from '@/components/drops/utils'
import { DropItem } from '@/params/types'
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from './types'

const props = defineProps<{
  mintCountAvailable: boolean
  minimumFunds: MinimumFundsProp
  mintButton: MintButtonProp
  holderOfCollection?: HolderOfCollectionProp
  dropStatus?: DropStatus
  dropStartTime?: Date
  drop: DropItem
}>()

const { $i18n } = useNuxtApp()

const scheduledStatuses: DropStatus[] = [
  DropStatus.SCHEDULED,
  DropStatus.SCHEDULED_SOON,
  DropStatus.COMING_SOON,
]

const isMintedOut = computed(() => !props.mintCountAvailable)
const showHolderOfCollection = computed(() => !!props.holderOfCollection?.id)
const showRequirements = ref(true)

const isCreateEventModalActive = ref(false)
const isFetchingDropStatus = computed(() => !props.dropStatus)

watchEffect(() => {
  if (props.dropStatus === DropStatus.MINTING_ENDED) {
    showRequirements.value = false
  }
})

const currentPhase = computed(() => {
  const iconColorInverse = props.dropStatus === DropStatus.MINTING_LIVE

  if (showHolderOfCollection.value) {
    return {
      title: $i18n.t('drops.phases.private'),
      icon: 'lock',
      iconColorInverse,
    }
  }
  return {
    title: $i18n.t('drops.phases.public'),
    icon: 'globe',
    iconColorInverse,
  }
})
const statusText = computed(() => {
  switch (props.dropStatus) {
    case DropStatus.MINTING_ENDED:
      return $i18n.t('drops.mintingEnded')
    case DropStatus.COMING_SOON:
      return $i18n.t('drops.comingSoon')
    case DropStatus.MINTING_LIVE:
      return $i18n.t('drops.mintingNow')
    case DropStatus.SCHEDULED_SOON:
      return toDropScheduledDurationString(props.dropStartTime as Date)
    case DropStatus.SCHEDULED:
      return formatDropStartTime(props.dropStartTime as Date, $i18n.locale)
    default:
      return ''
  }
})
</script>
