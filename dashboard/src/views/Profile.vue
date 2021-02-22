<template>
  <div class="profile-wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">Profile {{ id }}</p>
        </div>
      </div>
    </div>
    <!-- <GalleryCardList :items="nfts" /> -->
    <GalleryCardList :items="nfts" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { notificationTypes, showNotification } from '@/utils/notification';
import { fetchNFTMetadata, sanitizeIpfsUrl, defaultSortBy, fetchCollectionMetadata } from '@/components/rmrk/utils';
import {
  Collection,
  CollectionWithMeta,
  NFTWithMeta,
  Pack
} from '@/components/rmrk/service/scheme';
import GalleryCardList from '@/components/rmrk/Gallery/GalleryCardList.vue'

const components = { GalleryCardList };

@Component({ components })
export default class Profile extends Vue {
  private id: string = '';
  private isLoading: boolean = false;
  private collections: CollectionWithMeta[] = [];
  private nfts: NFTWithMeta[] = [];
  private packs: Pack[] = [];

  public async mounted() {
    this.checkId();
    const rmrkService = getInstance();
    if (!rmrkService || !this.id) {
      return;
    }

    this.isLoading = true;

    try {
      // this.nfts = await rmrkService.getNFTsForAccount(this.id).then(defaultSortBy);
      // this.collectionMeta();
      // const collections = await rmrkService.getCollectionListForAccount(
      //   this.id
      // ).then(defaultSortBy);
      const packs = await rmrkService.getPackListForAccount(this.id).then(defaultSortBy);
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger);
      console.warn(e);
    }

    this.isLoading = false;
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
  }

  collectionMeta() {
    this.nfts.map(fetchNFTMetadata).forEach(async (call, index) => {
      const res = await call;
      Vue.set(this.nfts, index, {
        ...this.nfts[index],
        ...res,
        image: sanitizeIpfsUrl(res.image || '')
      });
    });
  }
}
</script>
