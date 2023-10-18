<template>
  <div>
    <div class="min-h-full is-flex is-flex-direction-column">
      <MobileFilter />
      <Navbar />
      <main class="is-flex-grow-1">
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-subtitle="Please check your network connections"
          error-title="Offline Detected" />
        <ClientOnly v-else>
          <!-- new header component for collection here -->
          <div v-if="isCollection">
            <CollectionBanner :key="route.path" />
            <section class="pt-5">
              <div class="container is-fluid mobile-padding">
                <CollectionInfo />
                <hr class="mb-0" />
              </div>
            </section>
          </div>
          <section class="py-7 px-0">
            <div class="container is-fluid">
              <h1 v-if="isExplore" class="title">{{ getExploreTitle }}</h1>
              <ExploreTabsFilterSort />
            </div>
          </section>
          <hr class="text-color my-0" />
          <NuxtPage />
        </ClientOnly>
      </main>
    </div>
    <Buy />
    <template v-if="listingCartEnabled">
      <ListingCartMini />
      <ListingCartModal />
    </template>
  </div>
</template>

<script lang="ts" setup>
import ExploreTabsFilterSort from '@/components/explore/Controls.vue'
import MobileFilter from '@/components/shared/filters/MobileFilter.vue'
import CollectionBanner from '@/components/collection/CollectionHeader/CollectionBanner.vue'
import CollectionInfo from '@/components/collection/CollectionInfo.vue'
import Buy from '@/components/buy/Buy.vue'
import { assetHub, chainNameSeoMap, getSeoPrefixName } from '@/utils/seo'

const { $config } = useNuxtApp()
const route = useRoute()
const { listingCartEnabled } = useListingCartConfig()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()

useHead({
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: $config.public.baseUrl + route.path,
    },
  ],
})

const isExplore = computed(() => route.path.includes('/explore'))
const isCollection = computed(
  () => route.name?.toString().includes('prefix-collection-id'),
)

const getExploreTitle = computed(() => {
  if (
    Object.keys(chainNameSeoMap).includes(urlPrefix.value) &&
    assetHub.includes(urlPrefix.value)
  ) {
    if (route.path.includes('/collectibles')) {
      return `${$i18n.t('exploreCollections')} ${getSeoPrefixName(
        urlPrefix.value,
      )} Asset Hub`
    }

    if (route.path.includes('/items')) {
      return `${$i18n.t('exploreItems')} ${getSeoPrefixName(
        urlPrefix.value,
      )} Asset Hub`
    }
  }

  return $i18n.t('explore')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
hr {
  @include ktheme() {
    background: theme('k-grey');
  }
}
.text-color {
  @include ktheme() {
    background: theme('text-color');
  }
}

@include touch {
  .mobile-padding {
    padding: 0 1rem;
  }
}
</style>
