<template>
  <div v-if="visible" class="card nft-card">
    <div class="card-image" v-if="image">
      <figure class="image is-1by1 nft-image">
        <img
          :src="image"
          :alt="rmrk.view.sn"
        />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <b-tag type="is-info">{{ rmrk.action }}</b-tag>
        <div><b>collection: </b>{{ rmrk.view.collection }} </div>
        <div><b>name: </b>{{ rmrk.view.name }} </div>
        <div><b>instance: </b>{{ rmrk.view.instance }} </div>
        <div><b>transferable: </b>{{ rmrk.view.transferable }} </div>
        <div><b>sn: </b>{{ rmrk.view.sn }} </div>
        <div><b>description: </b>{{ metadata.description }} </div>
        <div><b>external url: </b>{{ metadata.external_url }} </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { RMRK, CollectionMetadata } from '../types';
import { fetchRmrkMeta, isEmpty, equals } from '../utils';
import { emptyObject } from '@/utils/empty';

@Component({})
export default class RmrkNftView extends Vue {
  @Prop() public rmrk!: RMRK;
  private image: string = ''
  private metadata: CollectionMetadata = emptyObject<CollectionMetadata>();

  get visible() {
    return !isEmpty(this.rmrk)
  }

  @Watch('rmrk')
  private async updateMeta(newRmrk: RMRK, oldRmrk: RMRK) {
    console.log(
      '🚀 ~ file: RmrkNftView.vue ~ line 22 ~ RmrkNftView ~ updateMeta ~ updateMeta',
      newRmrk
    );

    if (isEmpty(newRmrk)) {
      return;
    }

    this.metadata = await fetchRmrkMeta(newRmrk);

    if (this.metadata.image) {
      this.image = this.metadata.image.replace('ipfs://', 'https://ipfs.io/')
    }
    
  }
}
</script>


<style scoped>
.card.nft-card {
  margin: 1em !important;
  max-width: 25em;
}

.nft-image {
  max-width: 25em;
  max-height: 25em;
}

</style>
