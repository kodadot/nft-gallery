<template>
  <div>
    Profile works!
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { notificationTypes, showNotification } from '@/utils/notification';
import { Collection, CollectionWithMeta, NFTWithMeta, Pack } from '@/components/rmrk/service/scheme';

@Component({})
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
      const nfts = await rmrkService.getNFTsForAccount(this.id);
      const collections = await rmrkService.getCollectionListForAccount(this.id);
      const packs = await rmrkService.getPackListForAccount(this.id);
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
