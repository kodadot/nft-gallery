<template>
  <section class="border-b relative max-md:flex max-md:flex-col-reverse">
    <div class="!container mx-auto max-md:px-4">
      <div class="max-md:py-16 md:py-[96px] md:w-min lg:w-auto">
        <h1 class="flex items-center gap-6 flex-wrap items-center">
          <span class="text-7xl font-bold text-center capitalize md:inline">
            {{ $t('why') }}
          </span>
          <div class="h-[calc(100%-13px)] flex items-center">
            <img
              src="/Koda_logo.svg"
              alt="koda logo"
              class="h-full dark:hidden" />
            <img
              src="/Koda_logo_dark.svg"
              alt="koda logo dark mode"
              class="h-full hidden dark:block" />
          </div>
        </h1>

        <p class="!mt-6 text-xl">
          {{ $t('whyKoda.embraceTheFutureOfGenerativeArt') }}
        </p>

        <div class="!mt-10 md:mt-16">
          <ol
            class="text-xl md:text-2xl !pl-7 list-decimal w-[300px] !leading-7">
            <li v-for="section in sections" :key="section.id" class="!mb-3">
              <NeoButton
                v-safe-href="`#${section.id}`"
                tag="a"
                no-shadow
                variant="secondary-rounded"
                class="text-start text-xl md:text-2xl h-fit w-full !px-2 py-0 !leading-7">
                {{ section.name }}
              </NeoButton>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div
      class="md:absolute top-0 right-0 md:w-[55%] h-full overflow-hidden bg-neutral-3 dark:bg-neutral-11 max-md:border-b md:border-l">
      <div
        class="max-md:py-9 flex flex-col max-md:gap-4 md:gap-8 h-full justify-center">
        <div
          v-for="(nfts, index) in nftsByStrip"
          :key="`strip-${index}`"
          class="flex max-md:gap-4 md:gap-8 transform first:-translate-x-60 last:translate-x-4 last:md:translate-x-8">
          <div
            v-for="nft in nfts"
            :key="nft.id"
            class="max-md:min-w-[134px] max-md:h-[134px] md:h-[285px] md:min-w-[285px] relative overflow-hidden border rounded-xl shadow-primary">
            <BasicImage
              :src="sanitizeIpfsUrl(nft.meta.image)"
              :alt="nft?.name" />
          </div>
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

const NFTS_PER_STRIP = 7
const AMOUNT_OF_STRIPS = 2

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

const { data: items } = await useAsyncData(
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
      ).slice(0, NFTS_PER_STRIP * AMOUNT_OF_STRIPS),
  },
)

const nftsByStrip = computed(() => chunk(items?.value ?? [], NFTS_PER_STRIP))
</script>
