<template>
  <div>
    <b-table
      :data="data"
      hoverable
      :loading="isLoading"
      detailed
      paginated
      show-detail-icon
    >
      <b-table-column field="id" :label="$t('spotlight.id')" width="9em" v-slot="props">
        <router-link :to="{ name: 'profile', params: { id: props.row.id } }">
          <Identity :address="props.row.id" :inline="true" />
        </router-link>
      </b-table-column>

      <b-table-column
        field="sold"
        :label="$t('spotlight.sold')"
        v-slot="props"
      >
        {{ props.row.sold }}
      </b-table-column>

      <b-table-column
        field="unique"
        :label="$t('spotlight.unique')"
        v-slot="props"
      >
        {{ props.row.unique }}
      </b-table-column>

      <b-table-column
        field="total"
        :label="$t('spotlight.total')"
        v-slot="props"
      >
        {{ props.row.total }}
      </b-table-column>

      <b-table-column
        field="averagePrice"
        :label="$t('spotlight.averagePrice')"
        v-slot="props"
      >
        {{ Math.ceil(props.row.averagePrice * 100) / 100 }}
      </b-table-column>

      <b-table-column
        field="count"
        :label="$t('spotlight.count')"
        v-slot="props"
      >
        {{ props.row.count }}
      </b-table-column>


      <b-table-column
        field="collectors"
        :label="$t('spotlight.collectors')"
        v-slot="props"
      >
        {{ props.row.collectors }}
      </b-table-column>

      <template #detail="props">
        <SpotlightDetail v-if="props.row.total" :account="props.row.id" />
      </template>

      <template #empty>
        <div class="has-text-centered">{{ $t('spotlight.empty') }}</div>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Column, Row } from './types';
import { columns, nftFn } from './utils';
import collectionIssuerList from '@/queries/collectionIssuerList.graphql';
import { spotlightAggQuery } from '../rmrk/Gallery/Search/query';
import TransactionMixin from '@/utils/mixins/txMixin';

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  SpotlightDetail: () => import('./SpotlightDetail.vue')
};

@Component({ components })
export default class SpotlightTable extends Mixins(TransactionMixin) {
  @Prop() public value!: any;
  protected data: Row[] = [];
  protected columns: Column[] = columns;

  async created() {
    this.isLoading = true;
    const collections = await this.$apollo.query({
      query: collectionIssuerList
    });

    const {
      data: { collectionEntities }
    } = collections;

    this.data = spotlightAggQuery(
      collectionEntities?.nodes?.map(nftFn)
    ) as Row[];
    this.isLoading = false;
    // (window as any).cc = this.data;
  }
}
</script>
