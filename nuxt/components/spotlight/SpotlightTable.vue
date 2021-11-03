<template>
  <div>
    <b-table
      :data="toggleUsersWithIdentity ? usersWithIdentity : data"
      hoverable
      detailed
      paginated
      pagination-position="top"
      show-detail-icon
    >
      <template #top-left>
        <b-field>
          <div class="control is-flex">
            <b-switch
              v-model="toggleUsersWithIdentity"
              :rounded="false"
            >
              {{ $t('spotlight.filter_accounts') }}
            </b-switch>
          </div>
        </b-field>
      </template>
      <b-table-column
        v-slot="props"
        cell-class="short-identity__table"
        field="id"
        :label="$t('spotlight.id')"
      >
        <router-link
          v-if="!isLoading"
          :to="{ name: 'profile', params: { id: props.row.id } }"
        >
          <Identity
            :address="props.row.id"
            inline
            no-overflow
          />
        </router-link>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="sold"
        :label="$t('spotlight.sold')"
        sortable
      >
        <template v-if="!isLoading">
          {{ props.row.sold }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="unique"
        :label="$t('spotlight.unique')"
        sortable
      >
        <template v-if="!isLoading">
          {{ props.row.unique }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="total"
        :label="$t('spotlight.total')"
        sortable
      >
        <template v-if="!isLoading">
          {{ props.row.total }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="averagePrice"
        :label="$t('spotlight.averagePrice')"
        sortable
      >
        <template v-if="!isLoading">
          {{ Math.ceil(props.row.averagePrice * 100) / 100 }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="count"
        :label="$t('spotlight.count')"
        sortable
      >
        <template v-if="!isLoading">
          {{ props.row.count }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        field="rank"
        :label="$t('spotlight.score')"
        sortable
        numeric
      >
        <template #header="{column}">
          <b-tooltip
            label="sold * (unique / total)"
            append-to-body
            dashed
          >
            {{ column.label }}
          </b-tooltip>
        </template>
        <template
          v-if="!isLoading"
          #default="props"
        >
          {{ Math.ceil(props.row.rank * 100) / 100 }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <template #detail="props">
        <SpotlightDetail
          v-if="props.row.total"
          :account="props.row.id"
        />
        <div
          v-else
          class="has-text-centered"
        >
          {{ $t("spotlight.empty") }}
        </div>
      </template>

      <template #empty>
        <div
          v-if="!isLoading"
          class="has-text-centered"
        >
          {{ $t("spotlight.empty") }}
        </div>
        <b-skeleton :active="isLoading" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { Column, Row } from './types'
import { columns, nftFn } from './utils'
import collectionIssuerList from '@/queries/collectionIssuerList.graphql'
import { spotlightAggQuery } from '../rmrk/Gallery/Search/query'
import TransactionMixin from '@/utils/mixins/txMixin'
import { denyList } from '@/constants'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { get } from 'idb-keyval'
import { identityStore } from '@/utils/idbStore'
type Address = string | GenericAccountId | undefined;

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  SpotlightDetail: () => import('./SpotlightDetail.vue')
}

@Component({ components })
export default class SpotlightTable extends mixins(TransactionMixin) {
  @Prop() public value!: any;
  protected data: Row[] = [];
  protected columns: Column[] = columns;
  protected usersWithIdentity: Row[] = [];
  protected toggleUsersWithIdentity = false;

  async created() {
    this.isLoading = true
    const collections = await this.$apollo.query({
      query: collectionIssuerList,
      variables: {
        denyList
      }
    })

    const {
      data: { collectionEntities }
    } = collections

    this.data = spotlightAggQuery(
      collectionEntities?.nodes?.map(nftFn)
    ) as Row[]

    for (let index = 0; index < this.data.length; index++) {
      const result = await this.identityOf(this.data[index].id)
      if (result && Object.keys(result).length) {
        this.usersWithIdentity[index] = this.data[index]
      }
    }

    this.isLoading = false
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
}
</script>
<style>
  .short-identity__table {
    max-width: 12em;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
