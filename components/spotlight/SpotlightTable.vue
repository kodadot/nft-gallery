<template>
  <div class="spotlight">
    <Loader :value="isLoading" />
    <b-table
      :data="computedData"
      :current-page="currentPage"
      :default-sort="[sortBy.field, sortBy.value]"
      default-sort-direction="desc"
      hoverable
      detailed
      paginated
      pagination-position="top"
      backend-sorting
      show-detail-icon
      class="spotlight-sticky-header"
      @page-change="onPageChange"
      @sort="onSort">
      <template #top-left>
        <b-field class="mb-0">
          <div class="control is-flex">
            <b-switch v-model="onlyWithIdentity" :rounded="false">
              {{ $t('spotlight.filter_accounts') }}
            </b-switch>
            <!-- <b-switch
              v-if="isLogIn"
              class="gallery-switch"
              v-model="hasPassionFeed"
              :rounded="false">
              {{ $t('passion') }}
            </b-switch> -->
          </div>
        </b-field>
        <b-button
          class="ml-2 magicBtn is-bordered-light"
          :title="$t('tooltip.random')"
          type="is-primary"
          icon-left="dice"
          @click="goToRandomPage">
        </b-button>
      </template>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="id"
        :label="$t('spotlight.id')">
        <template v-if="!isLoading">
          <nuxt-link v-if="!isLoading" :to="`/${urlPrefix}/u/${props.row.id}`">
            <Identity :address="props.row.id" />
          </nuxt-link>
        </template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="sold"
        :label="$t('spotlight.sold')"
        sortable>
        <template v-if="!isLoading">{{ props.row.sold }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        cell-class="is-vcentered"
        field="unique"
        :label="$t('spotlight.unique')"
        sortable>
        <template #header="{ column }">
          <b-tooltip :label="$t('spotlight.uniqueItemsTooltip')" dashed>
            {{ column.label }}
          </b-tooltip>
        </template>
        <template v-if="!isLoading" #default="props">{{
          props.row.unique
        }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        cell-class="is-vcentered"
        field="uniqueCollectors"
        :label="$t('spotlight.uniqueCollectors')"
        sortable>
        <template #header="{ column }">
          <b-tooltip :label="$t('spotlight.uniqueCollectorsTooltip')" dashed>
            {{ column.label }}
          </b-tooltip>
        </template>
        <template v-if="!isLoading" #default="props">{{
          props.row.uniqueCollectors
        }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="total"
        :label="$t('spotlight.total')"
        sortable>
        <template v-if="!isLoading">{{ props.row.total }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="average"
        :label="$t('spotlight.averagePrice')"
        sortable>
        <template v-if="!isLoading">
          <Money :value="props.row.averagePrice" inline hide-unit />
        </template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="collections"
        :label="$t('spotlight.count')"
        sortable>
        <template v-if="!isLoading">{{ props.row.count }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="volume"
        label="Volume"
        sortable>
        <template v-if="!isLoading"
          ><Money :value="props.row.volume" inline hide-unit
        /></template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        cell-class="is-vcentered"
        field="rank"
        :label="$t('spotlight.score')"
        numeric>
        <template #header="{ column }">
          <b-tooltip :label="$t('spotlight.scoreCalc')" dashed>
            {{ column.label }}
          </b-tooltip>
        </template>
        <template v-if="!isLoading" #default="props">{{
          Math.ceil(props.row.rank * 100) / 100
        }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered has-text-centered history"
        field="soldHistory"
        :label="$t('spotlight.soldHistory')">
        <b-skeleton :active="isLoading" />
        <PulseChart
          v-if="!isLoading"
          :id="props.row.id"
          :labels="props.row.soldHistory.xAxisList"
          :values="props.row.soldHistory.yAxisList" />
      </b-table-column>

      <template #detail="props">
        <SpotlightDetail v-if="props.row.total" :account="props.row.id" />
        <div v-else class="has-text-centered">{{ $t('spotlight.empty') }}</div>
      </template>

      <template #empty>
        <div v-if="!isLoading" class="has-text-centered">
          {{ $t('spotlight.empty') }}
        </div>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'

import {
  axisLize,
  defaultEvents,
  lastmonthDate,
  onlyDate,
  toSort,
  today,
} from '@/components/series/utils'
import { SortType } from '@/components/series/types'
import { exist } from '@/components/search/exist'
import { getRandomIntInRange } from '@/components/rmrk/utils'

import KeyboardEventsMixin from '@/utils/mixins/keyboardEventsMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import TransactionMixin from '@/utils/mixins/txMixin'

import { PER_PAGE } from '@/utils/constants'

import { Row } from './types'

import spotlightList from '@/queries/rmrk/subsquid/spotlightList.graphql'
import spotlightSoldHistory from '@/queries/rmrk/subsquid/spotlightSoldHistory.graphql'

type Address = string | GenericAccountId | undefined

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  SpotlightDetail: () => import('./SpotlightDetail.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class SpotlightTable extends mixins(
  TransactionMixin,
  KeyboardEventsMixin,
  PrefixMixin
) {
  protected data: Row[] = []
  protected onlyWithIdentity = this.$route.query?.identity || false
  protected currentPage = 1
  protected sortBy: SortType = { field: 'sold', value: 'DESC' }
  // private hasPassionFeed = false

  async created() {
    exist(this.$route.query.sort, (val) => {
      this.sortBy.field = val.slice(1)
      this.sortBy.value = val.charAt(0) === '-' ? 'DESC' : 'ASC'
    })
    await this.fetchSpotlightData()
    this.initKeyboardEventHandler({
      g: this.bindPaginationEvents,
    })
  }

  private get pageSize() {
    return Math.ceil(this.total / PER_PAGE)
  }

  private get total() {
    return this.computedData.length
  }

  private get computedData() {
    return this.onlyWithIdentity
      ? this.data.filter((x) => x.hasIdentity)
      : this.data
  }

  public get ids(): string[] {
    if (this.computedData.length === 0) {
      return ['']
    }
    const start = (this.currentPage - 1) * PER_PAGE
    const end = this.currentPage * PER_PAGE
    return this.computedData.slice(start, end).map((x) => x.id)
  }

  private bindPaginationEvents(event) {
    switch (event.key) {
      case 'n':
        if (this.currentPage < this.pageSize) {
          this.currentPage = this.currentPage + 1
        }
        break
      case 'p':
        if (this.currentPage > 1) {
          this.currentPage = this.currentPage - 1
        }
        break
      case 'r':
        this.goToRandomPage()
        break
    }
  }

  public async fetchSpotlightData(sort: string = toSort(this.sortBy)) {
    this.isLoading = true
    const queryVars = {
      offset: 0,
      orderBy: sort || 'sold_DESC',
      // where: {},
    }
    // if (this.isLogIn && this.hasPassionFeed) {
    //   await this.fetchPassionList()
    //   queryVars.where = {
    //     id_in: this.passionList,
    //   }
    // }

    const collections = await this.$apollo.query({
      query: spotlightList,
      client: this.client,
      variables: queryVars,
    })

    const {
      data: { collectionEntities },
    } = collections

    this.data = collectionEntities.map(
      (e): Row => ({
        ...e,
        averagePrice: Number(e.averagePrice),
        collectors: e.sold,
        rank: e.sold * (e.unique / e.total || 1),
        uniqueCollectors: e.uniqueCollectors,
        volume: BigInt(e.volume),
        soldHistory: axisLize(defaultEvents(lastmonthDate, today)),
      })
    )

    for (let index = 0; index < this.data.length; index++) {
      const result = this.resolveAddress(this.data[index].id)
      if (result) {
        this.$set(this.data[index], 'hasIdentity', true)
      }
    }

    await this.updateSoldHistory()

    this.isLoading = false
  }

  protected async updateSoldHistory() {
    this.isLoading = true
    const defaultSoldEvents = defaultEvents(lastmonthDate, today)
    const solds = (await this.fetchSpotlightSoldHistory())
      .map((nft) => ({
        id: nft.issuer,
        timestamps: nft.events
          .flat()
          .map((x) => onlyDate(new Date(x.timestamp))),
      }))
      .reduce((res, e) => {
        const { id, timestamps } = e
        if (!res[id]) {
          res[id] = Object.assign({}, defaultSoldEvents)
        }
        timestamps.forEach((ts) => (res[id][ts] += 1))
        return res
      }, {})
    this.data.forEach((row) => {
      if (solds[row.id]) {
        this.$set(row, 'soldHistory', axisLize(solds[row.id]))
      }
    })

    this.isLoading = false
  }

  public async fetchSpotlightSoldHistory() {
    const data = await this.$apollo.query({
      query: spotlightSoldHistory,
      client: this.client,
      variables: {
        ids: this.ids,
        lte: today,
        gte: lastmonthDate,
      },
    })
    const {
      data: { nftEntities },
    } = data
    return nftEntities
  }

  private onPageChange(page: number) {
    this.currentPage = page
    this.updateSoldHistory()
  }

  @Watch('onlyWithIdentity')
  private async onOnlyWithIdentityChange(val: boolean) {
    this.replaceUrl(val ? 'true' : '', 'identity')
    await this.updateSoldHistory()
  }

  // @Watch('hasPassionFeed')
  // private onHasPassionFeed() {
  //   this.fetchSpotlightData()
  // }

  public onSort(field: string, order: string) {
    let sort: SortType = {
      field: field,
      value: order === 'desc' ? 'DESC' : 'ASC',
    }
    this.replaceUrl((order === 'desc' ? '-' : '+') + field, 'sort')
    this.fetchSpotlightData(toSort(sort))
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'sort') {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, [key]: value },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
  }

  private resolveAddress(account: Address): string {
    return account instanceof GenericAccountId
      ? account.toString()
      : account || ''
  }

  public async goToRandomPage() {
    let randomNumber = getRandomIntInRange(1, this.pageSize)
    this.currentPage = randomNumber
    await this.updateSoldHistory()
  }
}
</script>
<style scoped lang="scss">
.history {
  width: 200px;
  height: 100px;
}
.spotlight .magicBtn {
  position: absolute;
  right: 0;
}

.spotlight-sticky-header th {
  top: 120px;
  position: sticky;
  background-color: #0a0a0a;
}
</style>

<style lang="scss">
.spotlight .level-right {
  margin-right: 3rem;
}

@media only screen and (max-width: 768px) {
  .spotlight .magicBtn {
    top: 4rem;
    position: relative;
  }
  .spotlight .level-right {
    margin-left: 2rem;
    margin-right: 0rem;
  }
}
</style>
