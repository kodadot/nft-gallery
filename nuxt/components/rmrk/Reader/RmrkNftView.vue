<template>
  <div
    v-if="visible"
    class="card nft-card"
  >
    <div
      v-if="image"
      class="card-image"
    >
      <MediaResolver
        :src="image"
        :mime-type="mimeType"
      />
    </div>
    <div class="card-content">
      <div class="content">
        <b-tag type="is-info">
          {{ rmrk.action }}
        </b-tag>
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
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { RMRK, CollectionMetadata } from '../types'
import { fetchRmrkMeta, isEmpty } from '../utils'
import { emptyObject } from '@/utils/empty'
import MediaResolver from './MediaResolver.vue'

@Component({
  components: {
    MediaResolver
  }
})
export default class RmrkNftView extends Vue {
  @Prop() public rmrk!: RMRK;
  private image = ''
  private mimeType = ''
  private metadata: CollectionMetadata = emptyObject<CollectionMetadata>();

  get visible() {
    return !isEmpty(this.rmrk)
  }

  @Watch('rmrk')
  private async updateMeta(newRmrk: RMRK, oldRmrk: RMRK) {
    console.log(
      '🚀 ~ file: RmrkNftView.vue ~ line 22 ~ RmrkNftView ~ updateMeta ~ updateMeta',
      newRmrk
    )

    if (isEmpty(newRmrk)) {
      return
    }

    this.metadata = await fetchRmrkMeta(newRmrk)

    if (this.metadata.image) {
      this.image = this.metadata.image.replace('ipfs://', 'https://ipfs.io/')
    }

    this.metadata.attributes.forEach(attr => {
      if (attr.trait_type === 'Art media type') {
        this.mimeType = String(attr.value)
      }
    })

  }
}
</script>


<style scoped>
.card.nft-card {
  margin: 1em !important;
  max-width: 25em;
}

.card-image {
  padding: 1.5em;
}

.nft-image {
  max-width: 25em;
  max-height: 25em;
}

</style>
