<template>
  <div class="pack-item-wrapper container">
    <div class="columns">
      <div class="column">
        <h1 class="title is-4">
          Collection {{ id }}
        </h1>
      </div>
      <div class="column">
        <p v-if="issuer" class="subtitle">
          Creator <ProfileLink :address="issuer" :inline="true" :showTwitter="true"/>
        </p>
      </div>
      <div class="column is-2">
        <!-- <Sharing v-if="sharingVisible"
          label="Check this awesome Collection on %23KusamaNetwork %23KodaDot"
          :iframe="iframeSettings" /> -->
      </div>
    </div>

    <GalleryCardList :items="nfts" type="superDetail" :collection="id" />

  </div>
</template>

<script lang="ts" >
import { emptyObject } from '@/utils/empty';
import { cast } from '@/utils/cast';
import { notificationTypes, showNotification } from '@/utils/notification';
import { Component, Vue } from 'vue-property-decorator';
import { CollectionWithMeta, NFTWithMeta, Collection, NFT, NFTMetadata } from '../service/scheme';
import { sanitizeIpfsUrl, fetchCollectionMetadata, fetchNFTMetadata } from '../utils';
import isShareMode from '@/utils/isShareMode';

import Connector from '@vue-polkadot/vue-api';
import { Option } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { ClassInfoOf } from '@/components/bsx/types';

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue')
};

@Component<OrmlCollection>({
  components })
export default class OrmlCollection extends Vue {
  private issuer: string = '';
  private id: string = '';
  private collection: ClassInfoOf = emptyObject();
  private nfts: NFTWithMeta[] = [];
  private isLoading: boolean = false;


  get name() {
    return this.id
  }


  get sharingVisible() {
    return !isShareMode
  }

  public created() {
    this.checkId();
    this.loadMagic();
  }

    public async loadMagic() {

    await new Promise((resolve) => setTimeout(resolve, 1000));


    const { api } = Connector.getInstance();




    try {

      const classP = api.query.ormlNft.classes<Option<Codec>>(this.id);
      const nftP = api.query.ormlNft.tokens<Option<Codec>>(this.id, '');


      const classResult = await classP;


      if (classResult.isSome) {
        const collection = classResult.unwrap();
        this.collection = cast<ClassInfoOf>(collection.toHuman());

        const nftResult = await nftP;

        if (nftResult.isSome) {
          const nfts = nftResult.unwrap();
          console.log(nfts)
        }

      }


    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn);
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
}

</script>
