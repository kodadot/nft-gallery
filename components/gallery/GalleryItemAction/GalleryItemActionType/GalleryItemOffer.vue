<template>
  <GalleryItemPriceSection title="Highest Offer" :price="price">
    <GalleryItemPriceAction :active="active">
      <template #action>
        <NeoButton
          v-if="!active"
          label="Make Offer"
          size="large"
          fixed-width
          variant="k-blue"
          no-shadow
          @click.native="toggleActive" />
        <NeoButton
          v-if="active && !confirm"
          label="Confirm 1/2"
          size="large"
          fixed-width
          variant="k-blue"
          no-shadow
          @click.native="confirm1" />
        <NeoButton
          v-if="confirm"
          label="Confirm 2/2"
          size="large"
          fixed-width
          variant="k-blue"
          no-shadow
          @click.native="confirm2" />
      </template>

      <template #content>
        <div
          v-if="!confirm"
          class="offer is-flex is-justify-content-space-between is-align-items-center">
          <input
            class="offer-input"
            type="number"
            placeholder="Type Your Offer" />
          <div class="px-4">KSM</div>
        </div>
        <div
          v-else
          class="offer is-flex is-justify-content-space-evenly is-align-items-center">
          <div>Expire In:</div>
          <div>1 | 3 | 7 | 14 | 30</div>
          <div>Days</div>
        </div>
      </template>
    </GalleryItemPriceAction>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemPriceAction from '../GalleryItemActionCta.vue'

const props = defineProps<{
  nftId: string
  account: string
}>()

const { data } = useGraphql({
  queryName: 'offerHighest',
  queryPrefix: 'chain-bsx',
  variables: {
    id: props.nftId,
    account: props.account,
  },
})

const price = ref('')
const active = ref(false)
const confirm = ref(false)

function toggleActive() {
  active.value = !active.value
}

function confirm1() {
  confirm.value = true
}

function confirm2() {
  active.value = false
  confirm.value = false
}

watchEffect(() => {
  price.value = data.value?.offers[0]?.price || ''
})
</script>

<style lang="scss" scoped>
.offer {
  width: 20rem;

  &-input {
    border: 1px solid black;
    border-left: 0;
    height: 54px;
    outline: none;
    padding: 0 1rem;
    width: 100%;
  }
}
</style>
