<template>
  <div>
    <div class="column is-8 is-offset-2">
      <h1 class="title is-2 has-text-centered">
        {{ $t('statsOverview.bsxTitle') }}
      </h1>
      <StatsOverview />
    </div>
    <Loader v-model="pending" />
    <OfferTable
      :offers="offers"
      :account-id="accountId"
      is-bsx-stats
      :header-text="$t('nft.offer.title')"
      display-collection />
  </div>
</template>

<script lang="ts" setup>
import { Offer } from './types'
import offerList from '@/queries/subsquid/bsx/offerList.graphql'

import Loader from '@/components/shared/Loader.vue'
import OfferTable from '@/components/bsx/Offer/OfferTable.vue'
import StatsOverview from '@/components/bsx/Offer/StatsOverview.vue'

const offers = ref<Offer[]>([])

const { $consola } = useNuxtApp()
const { accountId } = useAuth()

const { pending } = useLazyAsyncData('data', async () => {
  try {
    const { data } = await useAsyncQuery(offerList, {})

    offers.value = data.offers
  } catch (e) {
    $consola.error(e)
  }
})
</script>
