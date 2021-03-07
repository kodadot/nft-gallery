<template>
  <div>
    <div class="nft-gallery__title">RMRK NFT Collection Gallery</div>
    <b-loading is-full-page v-model="isLoading" :can-cancel="true"></b-loading>
    <!-- <b-field label="Owners">
      <b-select
        placeholder="Select an owner"
        :value="selectedOwner"
        @input="handleOwner"
      >
        <option v-for="option in allOwners" :value="option" :key="option">
          {{ option }}
        </option>
      </b-select>
    </b-field> -->
    <div class="columns is-multiline ">
      <div
        class="column is-one-quarter-desktop is-one-third-tablet card nft-card "
        v-for="collection in collections"
        :key="collection.id"
      >
        <div class="card-image" v-if="collection.image">
          <b-image
            :src="collection.image"
            alt="Simple image"
            ratio="1by1"
            rounded
          ></b-image>
        </div>

        <div class="card-content">
          <b-tag type="is-primary" size="is-medium">{{ collection.symbol }}</b-tag>
          <div class="nft-card__index"><b># {{ collection.id }}</b></div>
          <div><b>Collection:</b>{{ collection.name }}</div>
          <div class="nft-card__owner"><b>Max:</b>{{ collection.max }}</div>
          <div class="nft-card__owner"><b>Owner:</b>{{ collection.issuer }}</div>
          <div class="nft-card__owner"><b>Description:</b>{{ collection.description }}</div>

          <!-- <b-taglist v-if="token.attributes">
            <b-tag
              type="is-dark"
              size="is-medium"
              v-for="attr in token.attributes"
              :key="attr"
            >
              {{ attr }}
            </b-tag>
          </b-taglist> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService'
import { Collection, CollectionMetadata, CollectionWithMeta } from '../service/scheme';
import { fetchCollectionMetadata, zip, sanitizeIpfsUrl } from '../utils';


@Component({})
export default class Gallery extends Vue {

  private collections: (Collection | CollectionWithMeta)[] = [];

  private isLoading: boolean = false;

  public async mounted() {
    const rmrkService = getInstance()

    if (!rmrkService) {
      return
    }

    this.isLoading = true

    try {
      this.collections = await rmrkService.getAllCollections()
      this.collectionMeta();

    } catch (e) {
      console.warn(e)
    }

    this.isLoading = false;

  }

  collectionMeta() {
    this.collections.map(fetchCollectionMetadata).forEach(async (call, index) => {
      const res = await call
      Vue.set(this.collections, index, {...this.collections[index], ...res, image: sanitizeIpfsUrl(res.image || '')})
    })


  }

}
</script>

<style scoped>
.card.nft-card {
  margin: 1em !important;
}
.nft-card__owner {
  word-break: break-word;
}
.nft-card__index {
  font-size: 1.35em;
  font-weight: bold;
}
.nft-gallery__title {
  font-size: 2em;
  font-weight: 500;
}
</style>
