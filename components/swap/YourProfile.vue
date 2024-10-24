<template>
  <section class="pt-5 container is-fluid flex flex-col space-y-10">
    <div class="flex justify-between">
      <SwapBannerTitle
        step="3/4"
        :title="$t('swap.selectOffer')"
        :subtitle="$t('swap.selectOfferSubtitle')"
      />

      <SwapBannerAccounts :counterparty="String(route.params.id)" />
    </div>

    <div class="columns">
      <div class="column">
        <hr class="mb-6 mt-0">
        // display list here
        <SwapGridList :query />
      </div>
      <div class="column is-narrow">
        <div class="border bg-background-color shadow-primary pb-6 w-full h-min md:w-[444px] lg:w-[490px] relative">
          <div class="px-6 py-4 flex justify-between border-b items-center">
            <div class="text-base font-bold line-height">
              {{ $t('swap.yourSwapList') }}
            </div>
          </div>

          <div class="p-6 min-h-[50vh] overflow-y-auto">
            YEET
          </div>

          <div class="pb-4 px-6">
            <div class="flex gap-4">
              <NeoButton
                size="large"
                label="Back"
                variant="text"
                no-shadow
                expanded
                @click="router.back()"
              />
              <NeoButton
                size="large"
                label="Next"
                variant="primary"
                no-shadow
                expanded
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const { accountId } = useAuth()
const route = useRoute()
const router = useRouter()

const query = reactive({
  currentOwner_eq: accountId.value,
  burned_eq: false,
})
</script>
