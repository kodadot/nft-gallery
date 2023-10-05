<template>
  <div>
    <div class="level my-4 collection is-align-items-center mb-5">
      <div
        v-for="key in keysObject"
        :key="key"
        class="level-item has-text-centered">
        <div>
          <p class="title">{{ returnTotalCounts(key, statsResponse) }}</p>
          <p class="heading">
            {{ $t(`statsOverview.${key}`) }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="data" class="level my-4 collection is-align-items-center mb-5">
      <div
        v-for="data in offerStats"
        :key="data.status"
        class="level-item has-text-centered">
        <div>
          <p class="title">
            {{ `${data.totalCount} /` }}
            <CommonTokenMoney :value="data.totalPrice" inline />
          </p>
          <p class="heading has-text-weight-bold mb-5">
            {{
              `${data.status} ${$t('statsOverview.offers')} / ${$t(
                'statsOverview.values',
              )}`
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OfferStats, StatsResponse } from './types'
import { countOf } from '~/utils/countOf'
import statsForBsx from '~/queries/subsquid/bsx/statsForBsx.graphql'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const { $consola } = useNuxtApp()
const { client } = usePrefix()

const statsResponse = ref<StatsResponse>()
const offerStats = ref<OfferStats>()
const keysObject = ref([])

const returnTotalCounts = (key, statsResponse) => {
  if (key === 'activeWallets') {
    return countOf(statsResponse.activeWallets[0])
  } else {
    return countOf(statsResponse[key])
  }
}

watchEffect(() => {
  try {
    const { result: data } = useQuery<StatsResponse>(
      statsForBsx,
      {},
      { clientId: client.value },
    )

    statsResponse.value = data.value
    offerStats.value = data.value.offerStats
    keysObject.value = Object.keys(data.value).filter(
      (key) => key !== 'offerStats',
    )
  } catch (e) {
    $consola.error(e)
  }
})
</script>

<style lang="scss" scoped>
.collection {
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(3, 1fr);
}

.title {
  font-size: 1.2rem;
}
</style>
