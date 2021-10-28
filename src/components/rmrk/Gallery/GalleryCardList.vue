<template>
  <div>
    <div class="content is-hidden-mobile" v-if="items">
      <b-field position="is-right">
        <b-tooltip label="Large display">
          <b-radio-button type="is-primary" v-model="layout" native-value="is-one-third-desktop is-one-third-tablet">
            <span>
              <b-icon icon="th-large"></b-icon>
            </span>
          </b-radio-button>
        </b-tooltip>
        <b-tooltip label="Small display">
          <b-radio-button type="is-primary" v-model="layout" native-value="is-one-fifth-desktop is-one-quarter-tablet">
            <span>
              <b-icon icon="th"></b-icon>
            </span>
          </b-radio-button>
        </b-tooltip>
      </b-field>
    </div>
    <div class="columns is-multiline">
      <div
        :class="`column ${layout}`"
        v-for="nft in items"
        :key="nft.id"
      >
        <GalleryCard
          :id="nft.id"
          :name="nft.name"
          :type="type"
          :link="link"
          :metadata="nft.metadata"
          :price="nft.price"
          :emoteCount="nft.emoteCount"
          :currentOwner="nft.currentOwner"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RmrkType } from '@/components/rmrk/service/scheme'

const components = {
  GalleryCard: () => import('./GalleryCard.vue')
}

@Component({ components })
export default class GalleryCardList extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop() public items!: RmrkType[];

  protected layout = 'is-one-third-desktop is-one-quarter-tablet'
}
</script>
<style>
.b-radio.radio.button.is-selected{
  background-color: #db2980;
}
</style>
