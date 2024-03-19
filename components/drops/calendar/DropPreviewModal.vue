<template>
  <div>
    <NeoModal
      :value="isModalActive"
      append-to-body
      no-shadow
      content-class="!p-10 h-full !absolute top-0 right-0 !border-y-0 max-md:!border-0 !border-r-0 !w-2/3 "
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

        <div class="!mt-6">
          <NeoButton no-shadow rounded @click="isCreateEventModalActive = true">
            {{ $t('scheduled') }}<span class="text-neutral-5 mx-2">•</span
            >{{ formattedDate }}
          </NeoButton>
        </div>

        <div class="flex justify-between !mt-6">
          <div>
            <span
              >{{ $t('artist') }}:
              <a
                v-safe-href="
                  `https://twitter.com/${dropCalendar.twitter_handle}`
                "
                class="has-text-link"
                target="_blank"
                rel="nofollow noopener noreferrer"
                >{{ dropCalendar.twitter_handle }}</a
              ></span
            >
          </div>

          <div v-if="dropCalendar.royalty">
            <p class="capitalize text-k-grey">
              {{ dropCalendar.royalty }}% {{ $t('royalty') }}
            </p>
          </div>
        </div>

        <div class="!mt-10">
          <h2 class="text-xl font-bold">{{ $t('drops.dropInformation') }}</h2>

          <div class="!mt-6 flex gap-16">
            <div>
              <span class="text-k-grey !mr-3">{{ $t('price') }}:</span>
              <span></span>
            </div>

            <div>
              <span class="text-k-grey !mr-3">{{ $t('supply') }}:</span>
              <span>{{ dropCalendar.supply || $t('helper.unlimited') }}</span>
            </div>
          </div>
        </div>

        <div class="!mt-6">
          <h2 class="text-lg font-bold">{{ $t('requirements') }}</h2>

          <ul class="list-disc !mt-4">
            <li v-if="dropCalendar.holder_of" class="ml-4">Holder Of NFT</li>
            <li v-if="dropCalendar.location" class="ml-4"></li>
          </ul>
        </div>

        <hr class="my-10" />

        <Markdown :source="dropCalendar.description" />
      </template>
    </NeoModal>

    <DropsCreateCalendarEventModal
      v-if="dropCalendar"
      v-model="isCreateEventModalActive"
      :title="`Drop: ${dropCalendar.name}`"
      :drop-start-time="dropStartTime"
      @close="isCreateEventModalActive = false" />
  </div>
</template>
<script lang="ts" setup>
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { format } from 'date-fns'
import { DropCalendar } from '@/services/fxart'

const emit = defineEmits(['close'])
const props = defineProps<{ dropCalendar?: DropCalendar }>()

const isCreateEventModalActive = ref(false)

const isModalActive = computed(() => Boolean(props.dropCalendar))
const formattedDate = computed(() =>
  dropStartTime.value
    ? `${format(dropStartTime.value, 'd. MMMM s:mm')} CET`
    : '',
)

const dropStartTime = computed(() =>
  props.dropCalendar
    ? new Date(`${props.dropCalendar.date} ${props.dropCalendar.time}`)
    : undefined,
)
</script>
