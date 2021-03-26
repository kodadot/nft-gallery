<template>
  <div>
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
    <Search :query.sync="searchQuery" />
    <div>
      <div class="columns is-multiline">
        <div
          class="column is-4"
          v-for="nft in results"
          :key="nft.id"
        >
          <div class="card nft-card">
            <router-link :to="{ name: 'nftDetail', params: { id: nft.id }}" tag="div" class="nft-card__skeleton">
              <div class="card-image" v-if="nft.image">
                <b-skeleton
                  height="240px"
                  :active="isLoading">
                </b-skeleton>
                <!-- <b-image
                  v-if="!isLoading"
                  :src="nft.image"
                  :src-fallback="require('@/utils/placeholder.png')"
                  alt="Simple image"
                  ratio="1by1"
                ></b-image> -->

                <figure class="">
                    <vue-freezeframe  v-if="!isLoading">
                      <img
                        :src="require('@/utils/placeholder.png')"
                        :data-src="nft.image"
                        alt="Simple image"
                        class="lazyload"
                      />
                    </vue-freezeframe>
                </figure>
              </div>

              <div v-else class="card-image">
                <b-image
                  :src="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
                  alt="Simple image"
                  ratio="1by1"
                ></b-image>
              </div>

              <div class="card-content">
                <p
                  v-if="!isLoading"
                  class="title is-4 has-text-centered">
                  <router-link :to="{ name: 'nftDetail', params: { id: nft.id }}">
                    {{ nft.name }}
                  </router-link>
                </p>
                <b-skeleton
                  :active="isLoading">
                </b-skeleton>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { NFTWithMeta, NFT } from '../service/scheme';
import { defaultSortBy, sanitizeObjectArray } from '../utils';
import GalleryCardList from './GalleryCardList.vue'
import Search from './Search/SearchBar.vue'
import { basicFilter } from './Search/query'
import got from 'got'
import FileType from 'file-type'
import axios from 'axios'
// const got = require('got');
// const FileType = require('file-type');
import Freezeframe from 'freezeframe';
import { extractCid } from '@/pinata';
import IPFS from 'ipfs'
import toStream from 'it-to-stream'
import { VueFreezeframe } from 'vue-freezeframe';
import 'lazysizes'

type NFTType = NFTWithMeta;
const components = { GalleryCardList, Search, VueFreezeframe }

@Component({ components })
export default class Gallery extends Vue {
  private nfts: NFTType[] = [];
  private isLoading: boolean = true;
  private searchQuery = ''

  public async mounted() {
    const rmrkService = getInstance();

    if (!rmrkService) {
      return;
    }

    try {
      this.nfts = await rmrkService.getAllNFTs()
      .then(sanitizeObjectArray)
      .then(defaultSortBy);
      // this.collectionMeta();
    } catch (e) {
      console.warn(e);
    }

    this.isLoading = false;
    new Freezeframe()
  }

  get results() {
    if (this.searchQuery) {
      return basicFilter(this.searchQuery, this.nfts)
    }

    return this.nfts
  }

  async onLoad(event, nft) {
    // logo.start(); // start animation
    // logo.stop(); // stop animation
    // logo.toggle(); // toggle animation
        // const cid = extractCid(src)

    // const file = await axios.get(src)
    // debugger
    // const type = await FileType.fromStream(toStream(file.data))
    // console.log(type, event)

    // if (type.ext === 'gif') {
    //   debugger
    //   const logo = new Freezeframe(event.path[0]);
    // }

    // const image = await axios.get(nft.image)
    // const type = image.headers['content-type']
    // if (type === 'image/gif') {
    //   const frame = document.getElementById(nft.id)
    //   console.log(event.target)
    //   const logo = new Freezeframe(frame, {
    //     trigger: false
    //   });

    //   // logo.start(); // start animation
    //   // logo.toggle(); // toggle animation
    // }


  	// console.log(await FileType.fromStream(stream));
//     const type = await FileType.fromStream(toStream(ipfs.cat(cid, {
//   length: 100 // or however many bytes you need
// })))
    // debugger
  }

}
</script>

