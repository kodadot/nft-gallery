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
import { notificationTypes, showNotification } from '@/utils/notification';
import { Component, Vue } from 'vue-property-decorator';
import { CollectionWithMeta, NFTWithMeta, Collection, NFT, NFTMetadata } from '../service/scheme';
import { sanitizeIpfsUrl, fetchCollectionMetadata, fetchNFTMetadata } from '../utils';
import isShareMode from '@/utils/isShareMode';
import collectionById from '@/queries/collectionById.graphql'
import { CollectionMetadata } from '../types';
import Connector from '@vue-polkadot/vue-api';
import abi from '../Create/abi'
import { ContractPromise } from '@polkadot/api-contract';
import { ContractCallOutcome } from '@polkadot/api-contract/types';

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue')
};

@Component<CollectionItem>({
  components })
export default class CollectionItem extends Vue {
  private issuer: string = '';
  private id: string = '';
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


  protected getContractResult(res: ContractCallOutcome): string {
    if (res.result.isOk) {
          return res.output?.toHuman() as string
        } else {
          return ''
        }
  }


    public async loadMagic() {

    const { api } = Connector.getInstance();

    try {
      const contract = new ContractPromise(api, abi, this.id);
      const acc = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
      const defaultOptions = {
        value: 0,
        gasLimit: -1
      }

      const total = await contract.query.totalSupply(acc, defaultOptions).then(this.getContractResult);
      console.log('loadMagic', total)


      this.nfts = await Promise.all(Array.from(Array(Number(total)).keys()).map(async (i): Promise<NFTWithMeta | undefined> => {
        try {
          const metaP = contract.query.tokenUri(acc, defaultOptions, i);
          const meta = await metaP.then(this.getContractResult);
          const nft = await fetchNFTMetadata({ metadata: meta } as NFT)
          return { ...emptyObject<NFTWithMeta>(), ...nft, metadata: meta, id: i.toString(), collection: this.id }
        } catch (e) {
          console.log(e);
          return;
        }
      }).filter(async (nft) => (await nft) !== undefined)) as NFTWithMeta[]


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
