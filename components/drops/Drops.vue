<template>
  <div>
    <div
      class="flex max-md:flex-col md:items-center justify-between mb-7 md:gap-8"
    >
      <h1 class="text-4xl font-semibold text-balance">
        <span class="block lg:inline mb-0 md:mr-3">{{ $i18n.t('drops.title') }},</span>
        <span class="inverse-text">{{ $i18n.t('drops.everyThursday') }}</span>
      </h1>

      <div
        class="max-md:pt-8 flex items-center flex-col md:flex-row gap-6 max-md:gap-4 md:justify-between flex-grow"
      >
        <NeoButton
          icon-left="plus"
          rounded
          variant="outlined-rounded"
          @click="isCreateEventModalActive = true"
        >
          {{ $t('drops.addToCal') }}
        </NeoButton>

        <nuxt-link
          class="flex-shrink-0"
          to="https://form.kodadot.xyz/drop-interest"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{{ $t('drops.createYourOwn') }}</span>
          <NeoIcon icon="arrow-up-right" />
        </nuxt-link>
      </div>
    </div>

    <!-- TODO: wrap it with dynamic grids -->
    <div class="grid grid-cols-5 gap-4">
      <DropsDropItem
        v-for="drop in dropItems"
        :key="drop.id"
        :drop="drop"
      />
    </div>

    <DropsCalendar
      :drops="dropItems"
      :loaded="dropItems?.length"
      :default-skeleton-count="4"
    />

    <template v-if="dropItems?.length">
      <hr class="my-14">

      <h2 class="text-3xl font-semibold mb-7">
        {{ $i18n.t('drops.pastArtDrops') }}
      </h2>

      <div class="grid grid-cols-5 gap-4">
        <DropsDropItem
          v-for="drop in dropItems"
          :key="drop.id"
          :drop="drop"
          :past-drop="true"
        />
      </div>

      <DropsCreateCalendarEventModal
        v-model="isCreateEventModalActive"
        :title="$t('drops.kodadotWeeklyGenerativeDrop')"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { useQuery } from '@tanstack/vue-query'
import { getDrops } from '~/services/fxart'

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const isCreateEventModalActive = ref(false)

const { data: dropItems } = useQuery({
  queryKey: ['drop-items', urlPrefix.value],
  queryFn: () => getDrops({
    active: [true],
    chain: [urlPrefix.value],
    limit: 100,
  }),
})
</script>
