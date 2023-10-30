<template>
  <div>
    <div class="mt-5">
      <p class="has-text-weight-bold">{{ $t('migrate.collection') }}</p>
      <div class="is-flex mt-4">
        <img
          class="border mr-4"
          :src="sanitizeIpfsUrl(collection?.meta?.image)"
          alt="My crazy adventure"
          width="48"
          height="48" />
        <div>
          <p>{{ collection?.name }}</p>
          <p class="has-text-grey is-size-7">
            {{ $t('migrate.collectionName') }}
          </p>
        </div>
      </div>
    </div>

    <hr />

    <div class="is-flex is-justify-content-space-between mb-5">
      <p>{{ $t('migrate.ready.status') }}</p>
      <p>{{ collection?.nftsOwned?.length }}/{{ collection?.nfts?.length }}</p>
    </div>

    <div class="shade-border-color p-2 is-flex is-size-7 has-text-grey">
      <NeoIcon icon="circle-info" class="mr-2" />
      <p>{{ $t('migrate.reviewNotes') }}</p>
    </div>

    <div>
      <p class="has-text-weight-bold mt-5">{{ $t('migrate.route') }}:</p>
      <NeoButton rounded variant="pill" class="mt-2 no-hover">
        <div class="is-flex is-align-items-center">
          <img
            width="20"
            :src="source?.icon"
            :alt="source?.text"
            class="mr-2" />
          {{ source?.text }}
        </div>
        <NeoIcon icon="chevron-right" class="mx-4" />
        <div class="is-flex is-align-items-center">
          <img
            width="20"
            :src="destination?.icon"
            :alt="destination?.text"
            class="mr-2" />
          {{ destination?.text }}
        </div>
      </NeoButton>
    </div>

    <hr />

    <div>
      <div class="has-text-weight-bold mt-5">{{ $t('migrate.costs') }}</div>

      <div class="is-size-7">
        <p
          class="my-2 has-text-grey is-cursor-pointer"
          @click="toggleFee = !toggleFee">
          {{ $t('migrate.feeBreakdown') }}
          <NeoIcon :icon="toggleFee ? 'chevron-up' : 'chevron-down'" />
        </p>

        <div v-if="toggleFee">
          <p>{{ $t('mint.nft.modal.networkFee') }}</p>

          <div class="is-flex is-justify-content-space-between mt-1">
            <div>
              <NeoIcon
                icon="arrow-turn-up"
                class="fa-flip-horizontal has-text-grey" />
              {{ $t('mint.collection.submit') }}
            </div>

            <div>0.02 KSM</div>
          </div>

          <div class="is-flex is-justify-content-space-between mt-1">
            <div>
              <NeoIcon
                icon="arrow-turn-up"
                class="fa-flip-horizontal has-text-grey" />
              Migrate 1790 Items
            </div>

            <div>3x 0.02 KSM</div>
          </div>

          <div class="is-flex is-justify-content-space-between mt-1">
            <div>
              <NeoIcon
                icon="arrow-turn-up"
                class="fa-flip-horizontal has-text-grey" />
              Pre-Sign 210 Items
            </div>

            <div>0.01 KSM</div>
          </div>

          <div
            class="has-text-grey is-flex mt-1 is-align-items-center is-justify-content-space-between">
            <div>
              {{ $t('migrate.existentialDeposit') }}
              <NeoTooltip
                position="top"
                class="is-cursor-pointer"
                multiline-width="14rem"
                multiline
                label="tooltip label here">
                <NeoIcon icon="circle-question" />
              </NeoTooltip>
            </div>
            <Money value="100000000000" unit-symbol="KSM" inline />
          </div>

          <div
            class="is-flex mt-1 has-text-grey is-align-items-center is-justify-content-space-between">
            <div>
              {{ $t('mint.nft.modal.kodadotFee') }}
              <NeoTooltip
                class="is-cursor-pointer"
                position="top"
                multiline-width="14rem"
                :label="$t('mint.nft.modal.kodadotTooltip')"
                multiline>
                <NeoIcon icon="circle-question" />
              </NeoTooltip>
            </div>
            <div>0.1358 KSM</div>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="pb-7 is-flex is-justify-content-space-between">
      <div class="">{{ $t('mint.nft.modal.totalFee') }}:</div>
      <div class="is-flex is-align-items-center">
        <div class="has-text-k-grey is-size-7 mr-2">$108</div>
        <div>10.9 KSM</div>
      </div>
    </div>

    <NeoField>
      <NeoCheckbox v-model="agree">{{ $t('migrate.agreement') }}</NeoCheckbox>
    </NeoField>

    <NeoButton
      :label="
        agree ? $t('migrate.reviewCtaCheck') : $t('migrate.reviewCtaUncheck')
      "
      variant="k-accent"
      :disabled="!agree"
      class="mt-4 btn-submit"
      expanded
      @click="toSign()" />
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoCheckbox,
  NeoField,
  NeoIcon,
  NeoTooltip,
} from '@kodadot1/brick'
import { useCollectionReady } from '@/components/migrate/utils'
import { availablePrefixWithIcon } from '@/utils/chain'

const route = useRoute()

const agree = ref(false)
const toggleFee = ref(true)
const source = availablePrefixWithIcon().find(
  (item) => item.value === route.query.source,
)
const destination = availablePrefixWithIcon().find(
  (item) => item.value === route.query.destination,
)

const toSign = () => {
  navigateTo({
    path: '/migrate/sign',
    query: {
      ...route.query,
    },
  })
}

const collectionId = route.query.collectionId
const { collections } = await useCollectionReady()
const collection = computed(() =>
  collections.value.find((item) => item.id === collectionId),
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.shade-border-color {
  @include ktheme() {
    border: 1px solid theme('k-shade');
  }
}

.btn-submit {
  height: 3.5rem;
}
</style>
