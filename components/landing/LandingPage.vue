<template>
  <div>
    <section>
      <LandingHeroBanner />
    </section>

    <template v-if="showCarousel">
      <!-- top collections -->
      <section
        v-if="showTopCollections"
        class="py-8 instance"
      >
        <div class="container-fluid">
          <LandingTopCollections class="my-5" />
        </div>
      </section>

      <section class="py-8 instance">
        <div class="container-fluid">
          <!-- generative  -->
          <LazyCarouselTypeGenerative
            v-if="dropsAhp.length"
            :collection-ids="dropsAhp"
          />
        </div>
      </section>

      <section class="py-8 instance">
        <div class="container-fluid">
          <!-- latest sales -->
          <LazyCarouselTypeLatestSales />

          <!-- new listings -->
          <LazyCarouselTypeNewestList class="mt-8" />
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Prefix } from '@kodadot1/static'
import { openProfileCreateModal } from '@/components/profile/create/openProfileModal'
import { useProfileOnboardingStore } from '@/stores/profileOnboarding'
import { getDrops } from '@/services/fxart'

const hiddenCarrouselPrefixes: Prefix[] = ['dot']
const forbiddenPrefixesForTopCollections: Prefix[] = ['ksm', 'dot']

const { urlPrefix } = usePrefix()
const profileOnboardingStore = useProfileOnboardingStore()
const { hasProfile, isFetchingProfile } = useProfile()

// currently only supported on rmrk
const showCarousel = computed(
  () => !hiddenCarrouselPrefixes.includes(urlPrefix.value),
)
const showTopCollections = computed(
  () => !forbiddenPrefixesForTopCollections.includes(urlPrefix.value),
)

watchEffect(() => {
  if (!hasProfile.value && !isFetchingProfile.value && profileOnboardingStore.getShouldShowOnboarding) {
    profileOnboardingStore.setOnboardingShown()

    // delay to show onboarding modal to avoid disturbing the user
    setTimeout(() => {
      openProfileCreateModal()
    }, 2000)
  }
})

const drops = await getDrops({
  limit: 12,
  active: [true],
  chain: ['ahp'],
})
const dropsAhp = drops.map(drop => drop.collection)
</script>
