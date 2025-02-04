<template>
  <div>
    <div class="min-h-full flex flex-col">
      <MobileFilter />
      <Navbar />
      <main class="flex-grow">
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-subtitle="Please check your network connections"
          error-title="Offline Detected"
        />
        <div v-else>
          <CollectionHeader v-if="isCollection" />
          <section class="py-7 px-0">
            <div class="grow relative w-full max-w-none mx-auto my-0 md:!px-10 !px-5">
              <h1
                v-if="isExplore"
                class="title"
              >
                {{ getExploreTitle }}
              </h1>
              <ExploreTabsFilterSort />
            </div>
          </section>
          <hr class="!bg-text-color my-0">
          <NuxtPage />
        </div>
      </main>
    </div>
    <Buy />
    <template v-if="listingCartEnabled">
      <ListingCartMini />
      <ListingCartModal />
      <UserCartModals />
    </template>

    <Loader
      v-model="$loader"
      :can-cancel="false"
    />
  </div>
</template>

<script lang="ts" setup>
import ExploreTabsFilterSort from '@/components/explore/Controls.vue'
import MobileFilter from '@/components/shared/filters/MobileFilter.vue'
import Buy from '@/components/buy/Buy.vue'
import { assetHub, chainNameSeoMap, getSeoPrefixName } from '@/utils/seo'

const { $config } = useNuxtApp()
const route = useRoute()
const { listingCartEnabled } = useListingCartConfig()
const { urlPrefix } = usePrefix()
const { $i18n, $loader } = useNuxtApp()

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
const isCollection = computed(() =>
  route.name?.toString().includes('prefix-collection-id'),
)

const getExploreTitle = computed(() => {
  if (
    Object.keys(chainNameSeoMap).includes(urlPrefix.value)
    && assetHub.includes(urlPrefix.value)
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
