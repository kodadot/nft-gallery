<template>
  <div>
    <NeoModal
      :value="isModalActive"
      append-to-body
      no-shadow
      content-class="!p-10 h-full !absolute top-0 right-0 !border-y-0 max-md:!border-0 !border-r-0 md:!w-2/3 "
      max-height="100vh"
      @close="emit('close')">
      <template v-if="dropCalendar">
        <header class="flex justify-between items-center">
          <span class="text-3xl font-bold">
            {{ dropCalendar.name }}
          </span>
          <NeoButton
            class="py-1 px-2"
            variant="text"
            no-shadow
            icon="xmark"
            size="large"
            @click="emit('close')" />
        </header>

        <div v-if="dropCalendar.dropStartTime" class="!mt-6">
          <NeoButton no-shadow rounded @click="isCreateEventModalActive = true">
            {{ $t('scheduled') }}<span class="text-neutral-5 mx-2">•</span
            >{{ formattedDate }}
          </NeoButton>
        </div>

        <div class="flex justify-between !mt-6">
          <div>
            <span :class="{ 'text-k-grey': !dropCalendar.twitter_handle }"
              >{{ $t('artist') }}:
            </span>
            <a
              v-if="dropCalendar.twitter_handle"
              v-safe-href="`https://twitter.com/${dropCalendar.twitter_handle}`"
              class="has-text-link"
              target="_blank"
              rel="nofollow noopener noreferrer"
              >{{ dropCalendar.twitter_handle }}</a
            >
            <span v-else> {{ placeholder }}</span>
          </div>

          <div v-if="dropCalendar.royalty">
            <p class="capitalize text-k-grey">
              {{ dropCalendar.royalty }}% {{ $t('royalty') }}
            </p>
          </div>
        </div>

        <CarouselModuleCarouselAgnostic
          v-if="dropCalendar.items.length"
          v-slot="{ item }"
          class="!mt-10"
          :items="dropCalendar.items"
          :config="config">
          <BaseMediaItem
            class="border border-k-shade"
            :src="sanitizeIpfsUrl(item.image)"
            preview
            is-detail />
        </CarouselModuleCarouselAgnostic>

        <div class="!mt-10">
          <h2 class="text-xl font-bold">{{ $t('drops.dropInformation') }}</h2>

          <div class="!mt-6 flex gap-16">
            <div>
              <span class="text-k-grey !mr-3">{{ $t('price') }}:</span>
              <span>{{ price }}</span>
            </div>

            <div>
              <span class="text-k-grey !mr-3">{{ $t('supply') }}:</span>
              <span>{{
                withPlaceholder(
                  dropCalendar.supply,
                  dropCalendar.supply || $t('helper.unlimited'),
                )
              }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="dropCalendar.holder_of || dropCalendar.location"
          class="!mt-6">
          <h2 class="text-lg font-bold">{{ $t('requirements') }}</h2>

          <ul class="list-disc !mt-4">
            <li v-if="dropCalendar.holder_of && collection" class="ml-4">
              Holder Of
              <nuxt-link
                class="has-text-link"
                :to="`/ahp/collection/${collection.id}`"
                >{{ collection.name }}</nuxt-link
              >
              NFT
            </li>
            <li v-if="dropCalendar.location" class="ml-4">
              Geolocation of {{ dropCalendar.location }}
            </li>
          </ul>
        </div>

        <hr class="!my-10" />

        <Markdown :source="dropCalendar.description ?? ''" />
      </template>
    </NeoModal>

    <DropsCreateCalendarEventModal
      v-if="dropCalendar"
      v-model="isCreateEventModalActive"
      :title="`Drop: ${dropCalendar.name}`"
      :drop-start-time="dropCalendar.dropStartTime ?? undefined"
      use-time-from-date
      @close="isCreateEventModalActive = false" />
  </div>
</template>
<script lang="ts" setup>
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { format } from 'date-fns'
import { useCollectionMinimal } from '~/components/collection/utils/useCollectionDetails'
import type { InternalDropCalendar } from './DropsCalendar.vue'

const placeholder = 'TBA'
const MOBILE_BREAKPOINT = 768

const emit = defineEmits(['close'])
const props = defineProps<{ dropCalendar?: InternalDropCalendar }>()

const { $i18n } = useNuxtApp()
const { decimalsOf } = useChain()
const { width } = useWindowSize()

const { formatted: formattedPrice } = useAmount(
  computed(() => props.dropCalendar?.price || ''),
  computed(() => decimalsOf('ahp')), // drops page only shows ahp drops
  computed(() => 'DOT'),
)

const { collection } = useCollectionMinimal({
  collectionId: computed(() => props.dropCalendar?.holder_of ?? ''),
})

const isCreateEventModalActive = ref(false)

const config = computed(() => ({
  slides: { perView: width.value > MOBILE_BREAKPOINT ? 2 : 1.2, spacing: 16 },
}))

const price = computed(() =>
  withPlaceholder(
    props.dropCalendar?.price,
    props.dropCalendar?.price ? formattedPrice.value : $i18n.t('free'),
  ),
)

const isModalActive = computed(() => Boolean(props.dropCalendar))

const formattedDate = computed(() =>
  props.dropCalendar?.dropStartTime
    ? `${format(props.dropCalendar.dropStartTime, 'd. MMMM h:mm aa')}`
    : '',
)

const withPlaceholder = (nullableValue: unknown, or: unknown) =>
  nullableValue === null ? placeholder : or
</script>
