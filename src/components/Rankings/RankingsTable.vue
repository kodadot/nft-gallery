<template>
  <div>
    <b-field>
        <div class="control is-flex">
            <b-switch v-model="toggleUsersWithIdentity" :rounded="false">Show Only Accounts With Identity</b-switch>
        </div>
    </b-field>
    <b-table
      :data="toggleUsersWithIdentity ? usersWithIdentity : data"
      hoverable
      paginated
    >
      <b-table-column
        cell-class="short-identity__table is-vcentered"
        field="id"
        label="N°"
        v-slot="props"
      >
        {{ data.indexOf(props.row) + 1}}
      </b-table-column>
      <b-table-column
        field="image"
        label=""
        v-slot="props"
        cell-class="is-vcentered"
      >
        <div class="container image is-48x48 mb-2">
          <b-image
            v-if="!isLoading"
            :src="props.row.image"
            :alt="props.row.name"
            ratio="1by1"
            rounded
          ></b-image>
        </div>
      </b-table-column>

      <b-table-column
        cell-class="short-identity__table is-vcentered"
        field="id"
        label="Collection"
        v-slot="props"
      >
        <router-link :to="{ name: 'collectionDetail', params: { id: props.row.id } }" v-if="!isLoading">
          {{ props.row.name }}
        </router-link>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="unique"
        :label="$t('spotlight.unique')"
        v-slot="props"
        sortable
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{ props.row.unique }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="averagePrice"
        :label="$t('spotlight.averagePrice')"
        v-slot="props"
        sortable
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{ Math.ceil(props.row.averagePrice * 100) / 100 }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="rank"
        :label="$t('spotlight.score')"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{ Math.ceil(props.row.rank * 100) / 100 }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="sold"
        :label="$t('spotlight.sold')"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{ props.row.sold }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="total"
        :label="$t('spotlight.total')"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{ props.row.total }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <template #empty>
        <div v-if="!isLoading" class="has-text-centered">{{ $t("spotlight.empty") }}</div>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Column, Row } from './types';
import { columns, nftFn } from './utils';
import collectionRankingsList from '@/queries/collectionRankingsList.graphql';
import { rankingsAggQuery } from '../rmrk/Gallery/Search/query';
import { NFTMetadata, Collection } from '../rmrk/service/scheme';
import TransactionMixin from '@/utils/mixins/txMixin';
import { denyList } from '@/constants';
import { GenericAccountId } from '@polkadot/types/generic/AccountId';
import { get } from 'idb-keyval';
import { identityStore } from '@/utils/idbStore';
import { sanitizeIpfsUrl, fetchCollectionMetadata } from '@/components/rmrk/utils';
import { emptyObject } from '@/utils/empty';

type Address = string | GenericAccountId | undefined;

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
};

@Component({ components })
export default class SpotlightTable extends Mixins(TransactionMixin) {
  @Prop() public value!: any;
  protected data: Row[] = [];
  protected columns: Column[] = columns;
  protected usersWithIdentity: Row[] = [];
  protected toggleUsersWithIdentity: boolean = false;
  public meta: NFTMetadata = emptyObject<NFTMetadata>();

  async created() {
    this.isLoading = true;
    const collections = await this.$apollo.query({
      query: collectionRankingsList,
      variables: {
        denyList
      }
    });

    const {
      data: { collectionEntities }
    } = collections;

    // console.log(collectionEntities?.nodes)

    this.data = rankingsAggQuery(
      collectionEntities?.nodes?.map(nftFn)
    ) as Row[];

    // TODO: fetch metadata for images
    for (let index = 0; index < this.data.length; index++) {
      // const result = await this.identityOf(this.data[index].id);
      // if (result && Object.keys(result).length) {
      //   this.usersWithIdentity[index] = this.data[index];
      // }
      const image = await this.fetchMetadataImage(this.data[index].metadata);

      if (image) {
        this.data[index].image = image;
      }
    }

    console.log(this.data)

    this.isLoading = false;
  }

  public async identityOf(account: Address) {
	  const address: string = this.resolveAddress(account);
	  const identity = await get(address, identityStore);
	  return identity;
	}

	private resolveAddress(account: Address): string {
	  return account instanceof GenericAccountId
	    ? account.toString()
	    : account || '';
	}

  public async fetchMetadataImage(metadata: any) {
    const meta = await fetchCollectionMetadata({metadata} as Collection)
    console.log(meta)
    return sanitizeIpfsUrl(meta.image || '')
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
