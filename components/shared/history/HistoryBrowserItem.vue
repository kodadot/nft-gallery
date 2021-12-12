<template>
    <b-dropdown-item
        aria-role="listitem"
        custom
        class="reset-padding"
    >
        <div class="item columns is-mobile reset-margin">
        <div class="column is-four-fifths reset-padding">
            <nuxt-link :to="`/rmrk/gallery/${item.id}`" class="columns is-mobile reset-padding reset-margin">
            <div class="column is-one-quarter no-padding-right">
                <b-image
                :src="item.image || '/placeholder.svg'"
                src-fallback="/placeholder.svg'"
                alt="KodaDot NFT minted multimedia"
                ratio="1by1"
                ></b-image>
            </div>
            <div class="column is-three-quarter no-padding-right">
                <div v-if="item.name" class="nft-title">{{ item.name | truncate(35) }}</div>
                <div v-if="item.collection"><span class="is-grey">in: </span><span class="is-italic">{{ item.collection | truncate(22) }}</span></div>
            </div>
            </nuxt-link>
        </div>
        <div class="column is-one-fifths center no-padding-right">
            <b-button
            type="is-primary"
            icon-left="trash"
            @click="removeItemFromHistory(item.id)"
            />
        </div>
        </div>
    </b-dropdown-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { HistoryItem } from '~/store/history';

@Component({
  filters: {
		truncate: function truncateFct(value, limit) {
			if (value?.length > limit) {
				value = `${value.substring(0, limit - 3)}…`;
			}
			return value;
		}
	}
})
export default class HistoryBrowserItem extends Vue {
  @Prop({ default: Object }) public item!: HistoryItem;
  
  removeItemFromHistory(id: string) {
    this.$store.dispatch('history/removeHistoryItem', id)
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.item {
  width: 100%;
  line-height: 1rem;
  justify-content: space-between;
}
@media screen and (min-width: 1024px) {
  .item {
    width: 400px;
  }
  .item button{
  display: none
  }
  .item:hover button{
    display: flex
  }
}
.item:hover {
  background-color: $primary;
}
.item:hover  a{
  color: white;
}
.no-padding-right {
  padding-right: 0;
}
.nft-title {
  margin-bottom: 0.3rem;
}
.is-grey {
  color: $text;
}
.reset-margin {
  margin: 0;
}
.reset-padding {
  padding: 0 !important;
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
