<template>
  <div class="pack-item-wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">
            {{ name }}
          </p>
          <p class="subtitle">
            Curated by: <ProfileLink v-if="owner" :address="owner" :inline="true" />
          </p>
          <Sharing label="Check this awesome Pack on %23KusamaNetwork %23KodaDot" />
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
import { CompletePack } from '../service/scheme';
import { fetchNFTMetadata, sanitizeIpfsUrl } from '../utils';

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue')
};

@Component({ components })
export default class PackItem extends Vue {
  private id: string = '';
  private pack: CompletePack = emptyObject<CompletePack>();
  private isLoading: boolean = false;

  get name() {
    return this.pack.name || this.id
  }

  get owner() {
    return this.pack.owner || ''
  }

  get nfts() {
    return this.pack.nfts || [];
  }

  public async mounted() {
  this.checkId();
  const rmrkService = getInstance();
  if (!rmrkService || !this.id) {
    return;
  }

  this.isLoading = true;

  try {
    this.pack = await rmrkService.getCompletePack(this.id);
    this.nftMeta();
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

  nftMeta() {
    this.pack.nfts.map(fetchNFTMetadata).forEach(async (call, index) => {
      const res = await call;
      Vue.set(this.pack.nfts, index, {
        ...this.pack.nfts[index],
        ...res,
        image: sanitizeIpfsUrl(res.image || '')
      });
    });
  }
}
</script>
