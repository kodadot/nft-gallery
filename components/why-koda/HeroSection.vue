<template>
  <section class="flex max-md:flex-col-reverse max-md:flex-col border-b">
    <div class="w-full md:w-1/2 flex justify-end max-md:border-t md:border-r">
      <div class="max-md:px-4 max-md:py-16 md:p-[96px]">
        <h1 class="flex items-center gap-6">
          <span class="text-6xl font-bold text-center capitalize md:inline">
            Why
          </span>
          <img
            src="~/public/Koda_logo.svg"
            alt="koda-logo"
            class="max-md:h-[42px] md:h-15" />
        </h1>

        <p class="!mt-6 text-xl">
          {{ $t('whyKoda.embraceTheFutureOfGenerativeArt') }}
        </p>

        <div class="!mt-10 md:mt-16">
          <ol class="text-2xl !pl-7 list-decimal w-[300px]">
            <li
              v-for="section in sections"
              :key="section.id"
              class="!mb-3 border rounded-full !px-5">
              <NeoButton
                variant="text"
                tag="a"
                no-shadow
                class="text-2xl"
                :href="`#${section.id}`">
                {{ section.name }}
              </NeoButton>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div
      class="w-full h-full md:w-1/2 flex h-full overflow-hidden bg-neutral-3 dark:bg-neutral-11">
      <div
        class="max-md:py-9 md:!py-[4.75rem] flex flex-col max-md:gap-4 md:gap-8 h-full">
        <div
          v-for="(nfts, index) in nftsByStrip"
          :key="`strip-${index}`"
          class="w-full flex max-md:gap-4 md:gap-8">
          <BaseMediaItem
            v-for="nft in nfts"
            :key="nft.id"
            :src="sanitizeIpfsUrl(nft.meta.image)"
            :alt="nft?.name"
            :class="{
              'transform -translate-x-60': index !== 1,
              'transform translate-x-4 md:translate-x-8': index === 1,
            }"
            is-detail
            class="max-md:w-[134px] max-md:h-[134px] md:w-[285px] md:h-[285px] object-cover border rounded-xl shadow-primary" />
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { getDrops } from '@/services/fxart'
import latestEvents from '@/queries/subsquid/general/latestEvents.graphql'
import chunk from 'lodash/chunk'
import uniqBy from 'lodash/uniqBy'

defineProps<{
  sections: { name: string; id: string }[]
}>()

const PER_STRIP = 10

const { data: collections } = await useAsyncData(
  () =>
    getDrops({
      limit: 12,
      active: [true],
      chain: ['ahp'],
    }),
  {
    transform: (data) => data.map((drop) => drop.collection),
  },
)

const { data: nftss } = await useAsyncData(
  async () => {
    const { data } = await useAsyncQuery<{ events: unknown[] }>({
      query: latestEvents,
      clientId: 'ahp',
      variables: {
        limit: 40,
        where: {
          nft: {
            collection: {
              id_in: collections.value || [],
            },
          },
        },
      },
    })
    return data?.value.events || []
  },
  {
    transform: (events) =>
      uniqBy(
        events.map((event) => event.nft),
        'id',
      ).slice(0, PER_STRIP * 2),
  },
)

const nftsByStrip = computed(() => chunk(nftss?.value ?? [], PER_STRIP))
</script>
