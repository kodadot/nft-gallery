<template>
  <b-dropdown aria-role="list" position="is-bottom-left">
    <template #trigger>
      <b-button type="is-primary is-bordered" icon-left="history" />
    </template>
    <div class="wrapper">
      <div v-if="visitedToday && visitedToday.length">
        <div class="list-header">Today</div>
        <HistoryBrowserItem
          v-for="item in visitedToday"
          :key="item.id"
          :item="item" />
      </div>
      <div v-if="visitedYesterday && visitedYesterday.length">
        <div class="list-header">Yesterday</div>
        <HistoryBrowserItem
          v-for="item in visitedYesterday"
          :key="item.id"
          :item="item" />
      </div>
      <div v-if="visitedPastWeek && visitedPastWeek.length">
        <div class="list-header">Last 7 Days</div>
        <HistoryBrowserItem
          v-for="item in visitedPastWeek"
          :key="item.id"
          :item="item" />
      </div>
      <div v-if="visitedPastMonth && visitedPastMonth.length">
        <div class="list-header">This Month</div>
        <HistoryBrowserItem
          v-for="item in visitedToday"
          :key="item.id"
          :item="item" />
      </div>
      <div v-if="visitedEarlier && visitedEarlier.length">
        <div class="list-header">Earlier</div>
        <HistoryBrowserItem
          v-for="item in visitedEarlier"
          :key="item.id"
          :item="item" />
      </div>
    </div>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import HistoryBrowserItem from '~/components/shared/history/HistoryBrowserItem.vue'
import { HistoryItem } from '~/store/history'

@Component({
  components: {
    HistoryBrowserItem,
  },
  filters: {
    truncate: function truncateFct(value, limit) {
      if (value?.length > limit) {
        value = `${value.substring(0, limit - 3)}...`
      }
      return value
    },
  },
})
export default class HistoryBrowser extends Vue {
  get hasHistory() {
    return this.history && this.history.length
  }

  get history() {
    return this.$store.state.history['visitedNFTs']
  }

  get visitedToday(): HistoryItem[] {
    return this.$store.getters['history/getVisitedToday']
  }

  get visitedYesterday(): HistoryItem[] {
    return this.$store.getters['history/getVisitedYesterday']
  }

  get visitedPastWeek(): HistoryItem[] {
    return this.$store.getters['history/getVisitedPastWeek']
  }

  get visitedPastMonth(): HistoryItem[] {
    return this.$store.getters['history/getVisitedPastMonth']
  }

  get visitedEarlier(): HistoryItem[] {
    return this.$store.getters['history/getVisitedEarlier']
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.wrapper {
  border: 2px solid $primary;
  max-height: 400px;
  overflow: auto;
}
.list-header {
  padding: 10px 0 0 12px;
  font-size: 1.2rem;
  font-weight: bold;
  position: sticky;
  top: 0;
  background: $black;
  z-index: 1;
}
</style>
