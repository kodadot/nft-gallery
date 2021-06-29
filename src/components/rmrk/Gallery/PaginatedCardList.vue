<template>
  <div>
    <Pagination :total="total" v-model="currentValue" />
    <GalleryCardList :items="items" />
    <Pagination
      class="pt-5 pb-5"
      :total="total"
      v-model="currentValue"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DocumentNode } from 'graphql';
import { NFTWithMeta } from '../service/scheme';

const components = {
  GalleryCardList: () => import('./GalleryCardList.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue')
};

@Component({ components })
export default class PaginatedCardList extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop() public query!: DocumentNode;
  @Prop(String) public account!: string;



  private currentValue = 1;
  private first = 20;
  private total = 0;
  protected items: NFTWithMeta[] = [];

  get offset() {
    return this.currentValue * this.first - this.first;
  }

  created() {
    this.$apollo.addSmartQuery('items', {
        query: this.query,
        manual: true,
        // update: ({ nFTEntities }) => nFTEntities.nodes,
        loadingKey: 'isLoading',
        result: this.handleResult,
        variables: () => {
          return {
            account: this.account,
            first: this.first,
            offset: this.offset
          };
        },
        fetchPolicy: 'cache-and-network'
      });
  }

  protected async handleResult({ data }: any) {
    if (data) {
      this.total = data.nFTEntities.totalCount;
      this.items = data.nFTEntities.nodes;
      this.$emit('change', this.total);
    }
  }


}
</script>
