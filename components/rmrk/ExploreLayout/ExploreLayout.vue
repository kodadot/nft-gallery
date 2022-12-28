<template>
  <div>
    <div v-if="$route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ $route.query.search }}</span>
    </div>
    <b-tabs v-model="selectedTab" data-cy="tabs" :animated="false">
      <b-tab-item :label="$t('collections')" value="collectibles">
        <template v-if="selectedTab === 'collectibles'">
          <CollectionList />
        </template>
      </b-tab-item>
      <b-tab-item :label="$t('gallery')" value="items"
        ><Gallery v-if="selectedTab === 'items'"
      /></b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CollectionList from '@/components/collection/CollectionList.vue'
import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {
  CollectionList,
}

@Component<ExploreLayout>({
  components,
})
export default class ExploreLayout extends mixins(PrefixMixin) {
  get tabOrder(): string {
    return this.$store.state.preferences.exploreTabOrder
  }

  get selectedTab(): string {
    console.log('this.$route.query', this.$route)
    return this.$route.name?.split('-')[2] as string
    // if (currenttab === 'collectibles') {

    // }
    // let defaultTab = 'collectibles'
    // if (this.tabOrder) {
    //   defaultTab = this.tabOrder
    // }
    // return (this.$route.query.tab as string) || defaultTab
  }

  set selectedTab(val) {
    console.log('valll', val)
    this.$route.query.page = ''
    let queryOptions: {
      // tab: string
      page: string
      search?: string | (string | null)[]
    } = {
      // tab: val,
      page: '1',
    }
    if (this.$route.query.search) {
      queryOptions.search = this.$route.query.search
    }

    this.$router.replace({
      path: val,
      query: queryOptions,
    })
  }
}
</script>
