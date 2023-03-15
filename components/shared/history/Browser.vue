<template>
  <b-dropdown v-if="hasHistory" aria-role="list" position="is-bottom-left">
    <template #trigger>
      <b-button
        type="is-primary is-bordered-light"
        class="navbar-link-background"
        icon-left="history" />
    </template>
    <div class="wrapper">
      <div v-if="visitedToday && visitedToday.length">
        <div class="list-header">{{ $t('history.today') }}</div>
        <HistoryBrowserItem
          v-for="item in visitedToday"
          :key="item.id"
          :item="item" />
      </div>
      <div v-if="visitedYesterday && visitedYesterday.length">
        <div class="list-header">{{ $t('history.yesterday') }}</div>
        <HistoryBrowserItem
          v-for="item in visitedYesterday"
          :key="item.id"
          :item="item" />
      </div>
      <div v-if="visitedPastWeek && visitedPastWeek.length">
        <div class="list-header">{{ $t('history.last7Days') }}</div>
        <HistoryBrowserItem
          v-for="item in visitedPastWeek"
          :key="item.id"
          :item="item" />
      </div>
      <div v-if="visitedPastMonth && visitedPastMonth.length">
        <div class="list-header">{{ $t('history.thisMonth') }}</div>
        <HistoryBrowserItem
          v-for="item in visitedPastMonth"
          :key="item.id"
          :item="item" />
      </div>
      <div v-if="visitedEarlier && visitedEarlier.length">
        <div class="list-header">{{ $t('history.earlier') }}</div>
        <HistoryBrowserItem
          v-for="item in visitedEarlier"
          :key="item.id"
          :item="item" />
      </div>
    </div>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { HistoryItem } from '~/store/history'
import { filterHistoryItemByPrefix } from '@/utils/history'
import PrefixMixin from '@/utils/mixins/prefixMixin'

@Component({
  filters: {
    truncate: function truncateFct(value, limit) {
      if (value?.length > limit) {
        value = `${value.substring(0, limit - 3)}...`
      }
      return value
    },
  },
})
export default class Browser extends mixins(PrefixMixin) {
  get hasHistory() {
    return this.history && this.history.length
  }

  get history() {
    return filterHistoryItemByPrefix(
      this.$store.state.history['visitedNFTs'],
      this.urlPrefix
    )
  }

  get visitedToday(): HistoryItem[] {
    return filterHistoryItemByPrefix(
      this.$store.getters['history/getVisitedToday'],
      this.urlPrefix
    )
  }

  get visitedYesterday(): HistoryItem[] {
    return filterHistoryItemByPrefix(
      this.$store.getters['history/getVisitedYesterday'],
      this.urlPrefix
    )
  }

  get visitedPastWeek(): HistoryItem[] {
    return filterHistoryItemByPrefix(
      this.$store.getters['history/getVisitedPastWeek'],
      this.urlPrefix
    )
  }

  get visitedPastMonth(): HistoryItem[] {
    return filterHistoryItemByPrefix(
      this.$store.getters['history/getVisitedPastMonth'],
      this.urlPrefix
    )
  }

  get visitedEarlier(): HistoryItem[] {
    return filterHistoryItemByPrefix(
      this.$store.getters['history/getVisitedEarlier'],
      this.urlPrefix
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
