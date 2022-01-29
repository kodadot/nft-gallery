<template>
  <div style="height: calc(50vw); width: calc(98vw)">
 <a-scene embedded>
        <!-- Player Rig -->
        <a-entity id="rig">
          <a-camera id="camera" look-controls wasd-controls>
            <!-- Enable the cursor to test a desktop browser -->
            <a-entity
                position="0 0 0"
                geometry="primitive: ring; radiusInner: 0.03; radiusOuter: 0.04;"
                material="color: red; shader: flat"
                cursor="maxDistance: 30; fuse: true;rayOrigin: mouse"
            >
            </a-entity>
          </a-camera>
          <a-entity
            laser-controls="hand: left; model: true;"
            raycaster="near: 0.1; far: 3; objects: .clickable"
          ></a-entity>
          <a-entity
            laser-controls="hand: right; model: true;"
            raycaster="near: 0.1; far: 3; objects: .clickable"
          ></a-entity>
        </a-entity>
        <!-- End Player Rig -->

        <a-plane
          position="0 0 -4"
          rotation="-90 0 0"
          width="10"
          height="10"
          :color="this.$brand.dark4"
        ></a-plane>
        <a-sky :color="this.$brand.light1"></a-sky>

        <!-- Loading Data: Directly from the EC API or the saved objects in local storage -->
        <template>
          <a-entity position="0 0.1 -1.4">
            <template>
                    <!-- v-bind:key="'api-' + item.id" -->
             <ItemCard3D
                v-for="(nft, index) in nfts"
                v-bind:item="nft"
                v-bind:startPosition="calculatePosition(index)"
              />
            </template>
          </a-entity>
        </template>

        <!-- Control Panel Prototype: This could be refactored into reusable buttons and controls. -->
        <a-entity id="controlPanel" position="0 1 -0.5" rotation="-35 0 0">
          <a-box
            position="0 0 -0.02"
            scale="0.1 0.1 0.1"
            width="10"
            height="2"
            depth="1"
            :color="this.$brand.dark3"
          >
          </a-box>
          <a-entity scale="0.1 0.1 0.1">
            <!-- <a-box
              position="-4.0 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="changeLayout('rowSingle')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.24"
                value="1x12"
              ></a-troika-text>
            </a-box>
            <a-box
              position="-2.8 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="changeLayout('rowDouble')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.24"
                value="2x6"
              ></a-troika-text>
            </a-box>
            <a-box
              position="-1.6 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="changeLayout('rowTriple')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.24"
                value="3x4"
              ></a-troika-text>
            </a-box> -->

            <a-box
              position="-0.5 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="loadPrevious()"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.5"
                value="<"
              ></a-troika-text>
            </a-box>
            <a-box
              position="1.2 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="loadNext()"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.5"
                value=">"
              ></a-troika-text>
            </a-box>

            <!-- <a-box
              position="3.2 0.3 0"
              width="2"
              height="0.5"
              :color="buttonColorAPI"
              control-button-hover
              class="clickable"
              v-on:click="changeDataSource('api')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="2"
                font-size="0.33"
                value="API Data"
              ></a-troika-text>
            </a-box>
            <a-box
              position="3.2 -0.3 0"
              width="2"
              height="0.5"
              :color="buttonColorFAV"
              control-button-hover
              class="clickable"
              v-on:click="changeDataSource('fav')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="1"
                font-size="0.3"
                value="Favorites"
              ></a-troika-text>
            </a-box> -->
          </a-entity>
        </a-entity>
        <!-- End Control Panel -->
      </a-scene>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import ItemCard3D from "./ItemCard3D.vue";
import { rowSingle, rowDouble, rowTriple } from "./helpers/formation.js";
import "./helpers/aframe-components.js";
import { brand } from "./helpers/brand.js";
import Axios from "axios";
import { NFT } from '~/components/rmrk/service/scheme';
import nftListByIssuer from '@/queries/nftListByIssuer.graphql'
import { getMany, update } from 'idb-keyval';
import { fetchNFTMetadata, getSanitizer } from '~/components/rmrk/utils';

//TODO: Handle brand variable
Vue.prototype.$brand = brand;

@Component({
  components: {
    ItemCard3D
  }
})
export default class Base extends Vue {
  public space = 'https://cdn.glitch.me/6d877418-2a34-48a1-b3eb-2cc2670deeef%2FKodaGallery%20Glb.glb?v=1637765084722'
  private nfts: NFT[] = [];
  private layoutType = "rowTriple"
  private dataSource = ""
  private page = 1
  private pageSize = 12
  private offset = 0

  @Prop(String) public id!: string;

  get formatedId(): string {
    return `issuer: ${this.id}`
  }

  public async mounted() {
     await this.fetchNFT()
  }

  private changeLayout(layout) {
      this.layoutType = layout;
    }

 private calculatePosition(index) {
      switch (this.layoutType) {
        case "rowSingle":
          return rowSingle[index];

        case "rowDouble":
          return rowDouble[index];

        case "rowTriple":
          return rowTriple[index];

        default:
          return rowSingle[index];
      }
  }

   private buttonColorAPI() {
      return this.dataSource === "api" ? this.$brand.blue : this.$brand.dark2;
    }
   private buttonColorFAV() {
      return this.dataSource === "fav" ? this.$brand.blue : this.$brand.dark2;
    }

  private async fetchNFT() {
    const nfts = this.$apollo.query({
      query: nftListByIssuer,
      variables: {
        first: this.pageSize,
        offset: this.offset,
        account: this.id,
      }
    })
    const {
      data: { nFTEntities: { nodes: nftList } }
    } = await nfts
      console.log("🚀 ~ file: Base.vue ~ line 248 ~ Base ~ fetchNFT ~ nftList", nftList)

    const storedPromise = getMany(
      nftList.map(({ metadata }: any) => metadata)
    )
    this.nfts = await storedPromise
    this.nfts.forEach((m, i) => {
        m.image = getSanitizer(m.image)(m.image)
        console.log("🚀 ~ file: Base.vue ~ line 266 ~ Base ~ this.nfts.forEach ~ .image", m.image)
    })
    //console.log("🚀 ~ file: Base.vue ~ line 225 ~ Base ~ fetchNFT ~ this.nfts", this.nfts)
  }

   private loadPrevious() {
      if (this.page > 1) {
        this.page = this.page - 1;
        this.offset = this.pageSize * (this.page - 1)
        console.log("🚀 ~ file: Base.vue ~ line 268 ~ Base ~ loadPrevious ~ this.offset", this.offset)
        this.fetchNFT();
      }
    }
  private loadNext() {
      //TODO: Handle next action once reached to the last page

      //if (this.page < this.itemResponse.headers["x-wp-totalpages"]) {
        this.page = this.page + 1;
        this.offset = this.pageSize * (this.page - 1)
        console.log("🚀 ~ file: Base.vue ~ line 274 ~ Base ~ loadNext ~ this.offset", this.offset)
        this.fetchNFT();
      //}
    }
}
</script>
