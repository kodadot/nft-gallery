<template>
  <div>
    <b-tabs v-model="selectedTab" size="is-small">
      <b-tab-item label="COLLECTION" value="COLLECTION">
        <CollectionList />
      </b-tab-item>
      <b-tab-item label="GALLERY" value="GALLERY"><Gallery /></b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, mixins, VModel, Vue, Watch } from 'nuxt-property-decorator'
import CollectionList from '@/components/rmrk/Collection/List/CollectionList.vue'

import PrefixMixin from '~/utils/mixins/prefixMixin'
import shouldUpdate from '~/utils/shouldUpdate'

const components = {
  CollectionList,
}

@Component<ExploreLayout>({
  components,
})
export default class ExploreLayout extends mixins(PrefixMixin) {
  get selectedTab(): string {
    return (this.$route.query.tab as string) || 'COLLECTION'
  }

  set selectedTab(val) {
    this.$route.query.page = ''
    let queryOptions: { tab: string; search?: string | (string | null)[] } = {
      tab: val,
    }
    if (this.$route.query.search) {
      queryOptions.search = this.$route.query.search
    }

    this.$router.replace({
      query: queryOptions,
    })
  }
}
</script>

<style scoped></style>
