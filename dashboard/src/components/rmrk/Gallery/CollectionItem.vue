<template>
  <div class="pack-item-wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">
            Collection {{ name }}
          </p>
          <p class="subtitle">
            Issued by: <ProfileLink v-if="owner" :address="owner" :inline="true" />
          </p>
          <Sharing v-if="sharingVisible" label="Check this awesome Collection on %23KusamaNetwork %23KodaDot" :iframe="iframeSettings" />
        </div>
      </div>
    </div>

    <GalleryCardList :items="nfts" />

  </div>
</template>

<script lang="ts" >
import { emptyObject } from '@/utils/empty';
import { notificationTypes, showNotification } from '@/utils/notification';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '../service/RmrkService';
import { CollectionWithMeta, NFTWithMeta, Collection } from '../service/scheme';
import { sanitizeIpfsUrl, defaultSortBy, fetchCollectionMetadata, sanitizeImage, sanitizeObjectArray } from '../utils';
import isShareMode from '@/utils/isShareMode';

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue')
};

@Component({ components })
export default class CollectionItem extends Vue {
  private id: string = '';
  private collection: CollectionWithMeta = emptyObject<CollectionWithMeta>();
  private nfts: NFTWithMeta[] = [];
  private isLoading: boolean = false;

  get name() {
    return this.collection.name || this.id
  }

  get owner() {
    return this.collection.issuer || ''
  }

  get sharingVisible() {
    return !isShareMode
  }

  public async mounted() {
  this.checkId();
  const rmrkService = getInstance();
  if (!rmrkService || !this.id) {
    return;
  }

  this.isLoading = true;

  try {
    this.collection = await rmrkService.getCollectionById(this.id).then(sanitizeImage);
    this.nfts = await rmrkService
        .getNFTsForCollection(this.id)
        .then(sanitizeObjectArray)
        .then(defaultSortBy);
    // this.nftMeta();
    // const collections = await rmrkService.getCollectionListForAccount(
    //   this.id
    // ).then(defaultSortBy);

    // console.log(packs)
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

  get iframeSettings() {
    return { width: '100%', height: '100vh' }
  }

  collectionMeta(collection: Collection) {
    fetchCollectionMetadata(collection)
    .then(
      meta => this.collection = {
        ...collection,
        ...meta,
        image: sanitizeIpfsUrl(meta.image || ''),
      },
      e => {
        showNotification(`${e}`, notificationTypes.danger);
        console.warn(e);
      }
    )
  }
}
</script>
