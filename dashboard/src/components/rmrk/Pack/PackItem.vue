<template>
  <div class="pack-item-wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">
            Profile
            <a :href="`https://kusama.subscan.io/account/${id}`" target="_blank"
              ><Identity :address="id"
            /></a>
          </p>
        </div>
      </div>
    </div>
    <b-tabs type="is-toggle" v-model="activeTab" expanded>
      <b-tab-item label="NFTs">
        <GalleryCardList :items="nfts" />    
      </b-tab-item>
      <b-tab-item label="Packs">
        <GalleryCardList :items="packs" type="packDetail" />
      </b-tab-item>
    </b-tabs>
    <!-- <GalleryCardList :items="nfts" /> -->
    
  </div>
</template>

<script lang="ts" >
import { emptyObject } from '@/utils/empty';
import { notificationTypes, showNotification } from '@/utils/notification';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '../service/RmrkService';
import { CompletePack } from '../service/scheme';

@Component({})
export default class PackItem extends Vue {
  private id: string = '';
  private pack: CompletePack = emptyObject<CompletePack>();
  private isLoading: boolean = false;

    public async mounted() {
    this.checkId();
    const rmrkService = getInstance();
    if (!rmrkService || !this.id) {
      return;
    }

    this.isLoading = true;

    try {
      this.pack = await rmrkService.getCompletePack(this.id)
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
}
</script>
