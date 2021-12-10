<template>
  <div class="history-browser">
    <b-dropdown aria-role="list" arrowless scrollable>
      <template #trigger="{ active }">
        <b-button
          type="is-primary"
          icon-left="history"
        />
      </template>
      <template v-if="history && history.length">
        <b-dropdown-item
          aria-role="listitem"
          v-for="item in history"
          :key="item.id"
          custom
          class="reset-padding"
        >
          <div class="item columns is-mobile reset-margin">
            <div class="column is-three-quarter reset-padding">
              <nuxt-link :to="`/rmrk/gallery/${item.id}`" class="columns is-mobile reset-padding reset-margin">
                <div class="column is-one-quarter no-padding-right">
                  <b-image
                    :src="item.image || '/placeholder.svg'"
                    src-fallback="/placeholder.svg'"
                    alt="KodaDot NFT minted multimedia"
                    ratio="1by1"
                  ></b-image>
                </div>
                <div class="column is-three-quarter">
                  <div v-if="item.name" class="ellipsis nft-title">{{ item.name }}</div>
                  <div v-if="item.date" class="ellipsis is-italic tiny-font">{{ formatDateAdded(item.date) }}</div>
                </div>
              </nuxt-link>
            </div>
            <div class="column is-one-quarter center">
              <b-button
                type="is-primary"
                icon-left="trash"
                @click="removeItemFromHistory(item.id)"
              />
            </div>
          </div>
        </b-dropdown-item>
      </template>
      <b-dropdown-item
        v-else-if="!history || history.length === 0"
        aria-role="listitem"
        custom
      >
        No entries yet
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { formatDistance } from 'date-fns'

@Component({
  components: {
  }
})
export default class HistoryBrowser extends Vue {
  get history() {
    return this.$store.state.history['visitedNFTs'];
  }

  formatDateAdded(date: Date): string {
    let formattedDate = formatDistance(
      new Date(date),
      new Date()
    ) 
    if (formattedDate === 'less than a minute') {
      formattedDate = '< 1 minute'
    }
    return `${formattedDate} ago`
  }

  removeItemFromHistory(id: string) {
    this.$store.dispatch('history/removeHistoryItem', id)
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.history-browser {
  margin: 12px 0 12px 12px;
}
@media screen and (min-width: 1024px) {
 .history-browser {
    margin: 0;
  }
}
.item {
  width: 100%;
  line-height: 1rem;
  justify-content: space-between;
}
@media screen and (min-width: 1024px) {
  .item {
    width: 280px;
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
.ellipsis {
  max-width: 145px;
  text-overflow: ellipsis;
  /* Required for text-overflow to do anything */
  white-space: nowrap;
  overflow: hidden;
}
.nft-title {
  margin-bottom: 0.2rem;
}
.tiny-font {
  font-size: 0.8rem;
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