<template>
  <div class="profile-wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">
            <b-icon
              pack="fas"
              icon="ghost"
            ></b-icon>
            <a :href="`https://kusama.subscan.io/account/${id}`" target="_blank"
              ><Identity :address="id" :inline="true"
            /></a>
          </p>
          <Sharing label="Check this awesome Profile on %23KusamaNetwork %23KodaDot" />
        </div>
      </div>
    </div>
    <b-tabs type="is-toggle" v-model="activeTab" expanded>
      <b-tab-item label="NFTs">
        <GalleryCardList :items="nfts" />
      </b-tab-item>
      <b-tab-item label="Collections">
        <GalleryCardList :items="collections" type="collectionDetail" />
      </b-tab-item>
      <b-tab-item label="Packs">
        <GalleryCardList :items="packs" type="packDetail" />
      </b-tab-item>
    </b-tabs>
    <!-- <GalleryCardList :items="nfts" /> -->

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { notificationTypes, showNotification } from '@/utils/notification';
import {
  defaultSortBy,
  sanitizeObjectArray
} from '@/components/rmrk/utils';
import {
  Collection,
  CollectionWithMeta,
  NFTWithMeta,
  Pack
} from '@/components/rmrk/service/scheme';

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue')
};

@Component({ components })
export default class Profile extends Vue {
  public activeTab: number = 0;
  protected id: string = '';
  protected isLoading: boolean = false;
  protected collections: CollectionWithMeta[] = [];
  protected nfts: NFTWithMeta[] = [];
  protected packs: Pack[] = [];

  public async mounted() {
    this.checkId();
    const rmrkService = getInstance();
    if (!rmrkService || !this.id) {
      return;
    }

    this.isLoading = true;

    try {
      this.nfts = await rmrkService
        .getNFTsForAccount(this.id)
        .then(sanitizeObjectArray)
        .then(defaultSortBy);
      // this.nftMeta();
      this.collections = await rmrkService.getCollectionListForAccount(
        this.id
      )
      .then(sanitizeObjectArray)
      .then(defaultSortBy);
      // this.collectionMeta();
      this.packs = await rmrkService.getPackListForAccount(this.id).then(defaultSortBy);
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

}
</script>
