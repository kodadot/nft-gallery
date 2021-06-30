<template>
   <b-table
   :data="data"
   :columns="columns"
   hoverable
   :loading="isLoading"
   detailed
   show-detail-icon
   >
    <template #detail="props">
      <SpotlightDetail :account="props.row.id" />
    </template>
   </b-table>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Column, Row } from './types'
import { columns } from './utils'
import collectionIssuerList from '@/queries/collectionIssuerList.graphql';
import { spotlightAggQuery } from '../rmrk/Gallery/Search/query';

const components = {
  SpotlightDetail: () => import('./SpotlightDetail.vue')
}


@Component({ components })
export default class SpotlightTable extends Vue {
  @Prop() public value!: any;
  protected data: Row[] = [];
  protected columns: Column[] = columns;
  protected isLoading: boolean = false;

  protected nftFn = (a: any): Row => ({ id: a.issuer, total: a.nfts.totalCount, sold: a.nfts.nodes.reduce(this.someFn, 0), unique: a.nfts.nodes.reduce(this.otherFn, new Set()).size })

  protected otherFn = (acc: Set<string>, val: { metadata: string }) => acc.add(val.metadata)
  protected someFn = (acc: number, val: { issuer: string, currentOwner: string }) => val.issuer !== val.currentOwner ? acc + 1 : acc


  async created() {
    const collections = await this.$apollo.query({
      query: collectionIssuerList,
    });

    const {
      data: { collectionEntities }
    } = collections;



    this.data = spotlightAggQuery(collectionEntities?.nodes?.map(this.nftFn)) as Row[];
    (window as any).cc = this.data;


  //   this.data  = [
  //   { id: 'Dx6nVUy6f2znn4ZwNZ3TGbEyUz3FLbCRGQGKAut4LxjCVRs', unique: 20, sold: 30 },
  //   { id: 'J6mwrrDE5ZywDe8T4mWgsdgHCcrDcrVtoGh37i7PSaZARRs', unique: 20, sold: 30 },
  //   { id: 'FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5', unique: 20, sold: 30 },
  //   { id: 'DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby', unique: 20, sold: 30 },

  //   // 'HtRTwHSP6fYC5PtCsJ7pG4H1hwyPhzXbtVTTVRJ6kvfPFe1', did not set identity
  //   // 'Cu7QaEnRGPE91WvLduzUii2ZNa3jhMWtmB8SYwumycNRmoN' did not set identity
  // ];
  }




}
</script>


// nftFn = a => ({ issuer: a.issuer, sold: a.nfts.nodes.reduce(someFn, 0), unique: a.nfts.nodes.reduce(otherFn, new Set()).size })

// otherFn = (acc, val) => acc.add(val.metadata)
// someFn = (acc, val) => val.issuer !== val.currentOwner ? acc + 1 : acc
