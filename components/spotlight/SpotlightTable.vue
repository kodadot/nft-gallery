<template>
  <div class="spotlight">
    <Loader :value="isLoading" />
    <b-table
      :data="toggleUsersWithIdentity ? usersWithIdentity : data"
      :current-page="currentPage ? currentPage : 1"
      :default-sort="[sortBy.field, sortBy.value]"
      hoverable
      detailed
      paginated
      pagination-position="top"
      backend-sorting
      show-detail-icon
      @sort="onSort">
      <template v-slot:top-left>
        <b-field class="mb-0">
          <div class="control is-flex">
            <b-switch v-model="toggleUsersWithIdentity" :rounded="false">
              {{ $t('spotlight.filter_accounts') }}
            </b-switch>
          </div>
        </b-field>
        <b-button
          class="ml-2 magicBtn"
          title="Go to random page"
          type="is-primary"
          icon-left="dice"
          @click="goToRandomPage">
        </b-button>
      </template>
      <b-table-column field="id" :label="$t('spotlight.id')" v-slot="props">
        <nuxt-link
          :to="{ name: 'rmrk-u-id', params: { id: props.row.id } }"
          v-if="!isLoading">
          <Identity :address="props.row.id" inline noOverflow />
        </nuxt-link>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="sold"
        :label="$t('spotlight.sold')"
        v-slot="props"
        sortable>
        <template v-if="!isLoading">{{ props.row.sold }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column field="unique" :label="$t('spotlight.unique')" sortable>
        <template v-slot:header="{ column }">
          <b-tooltip label="unique items" append-to-body dashed>
            {{ column.label }}
          </b-tooltip>
        </template>
        <template v-slot="props" v-if="!isLoading">{{
          props.row.unique
        }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="uniqueCollectors"
        :label="$t('spotlight.uniqueCollectors')"
        sortable>
        <template v-slot:header="{ column }">
          <b-tooltip label="unique collectors" append-to-body dashed>
            {{ column.label }}
          </b-tooltip>
        </template>
        <template v-slot="props" v-if="!isLoading">{{
          props.row.uniqueCollectors
        }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="total"
        :label="$t('spotlight.total')"
        v-slot="props"
        sortable>
        <template v-if="!isLoading">{{ props.row.total }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="averagePrice"
        :label="$t('spotlight.averagePrice')"
        v-slot="props">
        <template v-if="!isLoading"
          ><Money :value="props.row.averagePrice" inline
        /></template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="count"
        :label="$t('spotlight.count')"
        v-slot="props"
        sortable>
        <template v-if="!isLoading">{{ props.row.count }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column field="volume" label="Volume" v-slot="props" sortable>
        <template v-if="!isLoading"
          ><Money :value="props.row.volume" inline
        /></template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="rank"
        :label="$t('spotlight.score')"
        numeric>
        <template v-slot:header="{ column }">
          <b-tooltip label="sold * (unique / total)" append-to-body dashed>
            {{ column.label }}
          </b-tooltip>
        </template>
        <template v-slot="props" v-if="!isLoading">{{
          Math.ceil(props.row.rank * 100) / 100
        }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
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
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { Column, Row } from './types'
import { columns, nftFn } from './utils'
import collectionSpotlightList from '@/queries/rmrk/subsquid/collectionSpotlightList.graphql'

import TransactionMixin from '@/utils/mixins/txMixin'
import { denyList } from '@/utils/constants'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { get } from 'idb-keyval'
import { identityStore } from '@/utils/idbStore'
import { getRandomIntInRange } from '../rmrk/utils'
import PrefixMixin from '~/utils/mixins/prefixMixin'
type Address = string | GenericAccountId | undefined

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  SpotlightDetail: () => import('./SpotlightDetail.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class SpotlightTable extends mixins(
  TransactionMixin,
  PrefixMixin
) {
  @Prop() public value!: any
  protected data: Row[] = []
  protected columns: Column[] = columns
  protected usersWithIdentity: Row[] = []
  protected toggleUsersWithIdentity = false
  protected currentPage = 0
  protected sortBy = { field: 'sold', value: 'DESC' }

  async created() {
    await this.fetchSpotlightData()
  }

  public async fetchSpotlightData(limit = 10, sort = this.sortBy) {
    this.isLoading = true
    const collections = await this.$apollo.query({
      query: collectionSpotlightList,
      client: 'subsquid',
      variables: {
        // denyList, not yet
        limit,
        offset: '0',
        orderBy: sort.field,
        orderDirection: sort.value
      },
    })

    const {
      data: { collectionEntities },
    } = collections

    this.data = collectionEntities
      .map(
        (e): Row => ({
          ...e,
          averagePrice: Number(e.averagePrice),
          collectors: e.sold,
          rank: e.sold * (e.unique / e.total || 1),
          uniqueCollectors: e.uniqueCollectors,
          volume: BigInt(e.volume),
        })
      )

    for (let index = 0; index < this.data.length; index++) {
      const result = await this.identityOf(this.data[index].id)
      if (result && Object.keys(result).length) {
        this.usersWithIdentity[index] = this.data[index]
      }
    }

    this.isLoading = false
  }

  public onSort(field: string, order: string) {
    let sort = { field: field, value: order === 'desc' ? 'DESC' : 'ASC' }
    this.$router
      .replace({
        path: String(this.$route.path),
        query: {
          ...this.$route.query,
          sort: (order === 'desc' ? '-' : '+') + field,
        },
      })
      .catch((e) => console.warn(e))
    this.fetchSpotlightData(10, sort)
  }

  public async identityOf(account: Address) {
    const address: string = this.resolveAddress(account)
    const identity = await get(address, identityStore)
    return identity
  }

  private resolveAddress(account: Address): string {
    return account instanceof GenericAccountId
      ? account.toString()
      : account || ''
  }

  public goToRandomPage() {
    const total = this.toggleUsersWithIdentity
      ? this.usersWithIdentity.length
      : this.data.length
    const pageSize = Math.floor(total / 20)
    let randomNumber = getRandomIntInRange(1, pageSize)
    this.currentPage = randomNumber
  }
}
</script>
<style>
.spotlight .magicBtn {
  position: absolute;
  right: 0;
}

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
