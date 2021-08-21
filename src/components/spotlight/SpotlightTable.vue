<template>
  <div>
    <b-field>
      <b-switch v-model="isShowIdentity" @input="filterData()" :rounded="false">
        Show Only Accounts With Identity
      </b-switch>
    </b-field>
    
    <b-table
      :data="data"
      hoverable
      :loading="isLoading"
      detailed
      paginated
      show-detail-icon
    >
      <b-table-column
        cell-class="short-identity__table"
        field="id"
        :label="$t('spotlight.id')"
        v-slot="props"
      >
        <router-link :to="{ name: 'profile', params: { id: props.row.id } }">
          <Identity :address="props.row.id" inline noOverflow />
        </router-link>
      </b-table-column>

      <b-table-column
        field="sold"
        :label="$t('spotlight.sold')"
        v-slot="props"
        sortable
      >
        {{ props.row.sold }}
      </b-table-column>

      <b-table-column
        field="unique"
        :label="$t('spotlight.unique')"
        v-slot="props"
        sortable
      >
        {{ props.row.unique }}
      </b-table-column>

      <b-table-column
        field="total"
        :label="$t('spotlight.total')"
        v-slot="props"
        sortable
      >
        {{ props.row.total }}
      </b-table-column>

      <b-table-column
        field="averagePrice"
        :label="$t('spotlight.averagePrice')"
        v-slot="props"
        sortable
      >
        {{ Math.ceil(props.row.averagePrice * 100) / 100 }}
      </b-table-column>

      <b-table-column
        field="count"
        :label="$t('spotlight.count')"
        v-slot="props"
        sortable
      >
        {{ props.row.count }}
      </b-table-column>

      <b-table-column
        field="rank"
        :label="$t('spotlight.score')"
        v-slot="props"
        sortable
      >
        {{ Math.ceil(props.row.rank * 100) / 100 }}
      </b-table-column>

      <template #detail="props">
        <SpotlightDetail v-if="props.row.total" :account="props.row.id" />
        <div v-else class="has-text-centered">{{ $t("spotlight.empty") }}</div>
      </template>

      <template #empty>
        <div class="has-text-centered">{{ $t("spotlight.empty") }}</div>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import { Column, Row } from "./types";
import { columns, nftFn } from "./utils";
import collectionIssuerList from "@/queries/collectionIssuerList.graphql";
import { spotlightAggQuery } from "../rmrk/Gallery/Search/query";
import TransactionMixin from "@/utils/mixins/txMixin";
import { denyList } from "@/constants";

import { GenericAccountId } from "@polkadot/types/generic/AccountId";
import { get } from "idb-keyval";
import { identityStore } from "@/utils/idbStore";
type Address = string | GenericAccountId | undefined;

const components = {
	Identity: () => import("@/components/shared/format/Identity.vue"),
	SpotlightDetail: () => import("./SpotlightDetail.vue"),
};

@Component({ components })
export default class SpotlightTable extends Mixins(TransactionMixin) {
	@Prop() public value!: any;
	protected data: Row[] = [];
	protected columns: Column[] = columns;
	public isShowIdentity: boolean = true;

	async created() {
		this.isShowIdentity = true;
		await this.fetchData();
	}

	protected async fetchData() {
		this.isLoading = true;

		this.data = [];
		this.columns = [];

		const collections = await this.$apollo.query({
			query: collectionIssuerList,
			variables: {
				denyList,
			},
		});

		const {
			data: { collectionEntities },
		} = collections;

		let filterData: Row[] = [];

		filterData = spotlightAggQuery(
			collectionEntities?.nodes?.map(nftFn)
		) as Row[];

		let filterIndex = 0;

		for (let index = 0; index < filterData.length; index++) {
			const result = await this.identityOf(filterData[index].id);

			if (this.isShowIdentity) {
				if (result && Object.keys(result).length !== 0) {
					this.data[filterIndex++] = filterData[index];
				}
			} else {
				this.data[index] = filterData[index];
			}
		}

		this.isLoading = false;
	}

	public async filterData() {
		await this.fetchData();
	}

	public async identityOf(account: Address) {
		const address: string = this.resolveAddress(account);
		const identity = await get(address, identityStore);

		return identity;
	}

	private resolveAddress(account: Address): string {
		return account instanceof GenericAccountId
			? account.toString()
			: account || "";
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
