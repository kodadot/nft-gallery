<template>
  <div>
    <div
      class="flex max-md:flex-col md:items-center justify-between mb-7 md:gap-8">
      <h1 class="text-4xl font-semibold text-balance">
        <span class="block lg:inline mb-0 md:mr-3"
          >{{ $i18n.t('drops.title') }},</span
        >
        <span class="inverse-text">{{ $i18n.t('drops.everyThursday') }}</span>
      </h1>

      <div
        class="max-md:pt-8 flex items-center max-md:gap-8 md:justify-between flex-grow">
        <NeoButton
          icon-left="plus"
          rounded
          variant="outlined-rounded"
          @click="isCreateEventModalActive = true">
          {{ $t('drops.addToCal') }}</NeoButton
        >

        <nuxt-link
          class="flex-shrink-0"
          to="https://form.kodadot.xyz/drop-interest"
          target="_blank"
          rel="noopener noreferrer">
          <span>{{ $t('drops.createYourOwn') }}</span>
          <NeoIcon icon="arrow-up-right" />
        </nuxt-link>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      <template v-if="!loaded">
        <DropsDropCardSkeleton
          v-for="x in DEFAULT_SKELETON_COUNT"
          :key="`current-drops-skeleton-${x}`" />
      </template>
      <div
        v-for="(drop, index) in currentDrops"
        v-else
        :key="`${drop.collection?.id}=${index}`"
        class="w-full h-full"
        :data-testid="index">
        <DropCard :drop="drop" />
      </div>
    </div>

    <hr class="my-14" />

    <h2 class="text-3xl font-semibold mb-7">
      {{ $i18n.t('drops.pastArtDrops') }}
    </h2>

    <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      <template v-if="!loaded">
        <DropsDropCardSkeleton
          v-for="x in DEFAULT_SKELETON_COUNT"
          :key="`skeleton-${x}`" />
      </template>
      <div
        v-for="(drop, index) in pastDrops"
        :key="`${drop.collection?.id}=${index}`"
        v-lese
        class="w-full h-full"
        :data-testid="index">
        <DropCard :drop="drop" />
      </div>
    </div>

    <DropsCreateCalendarEventModal v-model="isCreateEventModalActive" />
  </div>
</template>

<script lang="ts" setup>
import DropCard from '@/components/drops/DropCard.vue'
import { DropStatus, useDrops } from './useDrops'
import { dropsVisible } from '@/utils/config/permission.config'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import filter from 'lodash/filter'

const DEFAULT_SKELETON_COUNT = 4
const CURRENT_DROP_STATUS = Object.values(DropStatus).filter(
  (status) => status !== DropStatus.MINTING_ENDED,
)

const { $i18n } = useNuxtApp()
const { drops, loaded } = useDrops({ active: [true, false] })
const { urlPrefix } = usePrefix()

const isCreateEventModalActive = ref(false)

const currentDrops = computed(() =>
  filter(drops.value, (drop) => CURRENT_DROP_STATUS.includes(drop.status)),
)

const pastDrops = computed(() =>
  filter(drops.value, { status: DropStatus.MINTING_ENDED }),
)

const checkRouteAvailability = () => {
  if (!dropsVisible(urlPrefix.value)) {
    navigateTo('/')
  }
}

watch(urlPrefix, () => checkRouteAvailability())

onBeforeMount(() => {
  checkRouteAvailability()
})
</script>
