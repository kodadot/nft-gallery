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
        <div v-else>
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
              <h1 v-if="isExplore" class="title">{{ $t('explore') }}</h1>
              <ExploreTabsFilterSort />
            </div>
          </section>
          <hr class="text-color my-0" />
          <NuxtPage />
        </div>
      </main>
    </div>
    <template v-if="listingCartEnabled">
      <ListingCartMini />
      <ListingCartModal />
    </template>

    <Buy @success="handleBuy" />

    <MessageNotify
      v-if="message"
      :title="message.title"
      :subtitle="message.subtitle"
      @close="message = null" />
  </div>
</template>

<script lang="ts" setup>
import ExploreTabsFilterSort from '@/components/explore/Controls.vue'
import MobileFilter from '@/components/shared/filters/MobileFilter.vue'
import CollectionBanner from '@/components/collection/CollectionHeader/CollectionBanner.vue'
import CollectionInfo from '@/components/collection/CollectionInfo.vue'
import Buy from '@/components/buy/Buy.vue'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'

const { $config, $i18n } = useNuxtApp()
const route = useRoute()
const { listingCartEnabled } = useListingCartConfig()
const message = ref()

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
  route.name?.includes('prefix-collection-id')
)

const handleBuy = (items: ShoppingCartItem[]) => {
  const itemNames = items.map((item) => item.name).join(', ')
  message.value = {
    title: $i18n.t('mint.success'),
    subtitle: $i18n.t('mint.successPurchasedNfts', [itemNames]),
  }
}
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
