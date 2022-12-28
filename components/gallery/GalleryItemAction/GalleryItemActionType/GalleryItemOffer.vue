<template>
  <GalleryItemPriceSection title="Highest Offer" :price="price">
    <GalleryItemActionSlides ref="actionRef" :active="active">
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
          <div class="is-flex offer-days">
            <div v-for="day in days" :key="day">
              <input
                :id="`${day}`"
                v-model="selectedDay"
                type="radio"
                name="days"
                :value="day" />
              <label :for="`${day}`">{{ day }}</label>
            </div>
          </div>
          <div>Days</div>
        </div>
      </template>
    </GalleryItemActionSlides>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { onClickOutside } from '@vueuse/core'

import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'

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
const days = [1, 3, 7, 14, 30]
const selectedDay = ref(14)

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

const actionRef = ref(null)
onClickOutside(actionRef, () => confirm2())
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.dark-mode {
  .slide {
    box-shadow: 4px 4px 0 white;
  }

  .is-neo {
    color: black;
    background: $k-blue;

    &:hover {
      background: $k-dark;
      color: white;
    }
  }
}
.is-neo {
  &:hover {
    background: white;
  }
}
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

  &-days {
    justify-content: center;
    width: 45%;

    input[type='radio'] {
      display: none;

      &:checked + label {
        font-weight: bold;
      }
    }

    label {
      cursor: pointer;
      display: block;
      line-height: 1;
      // width: 1.5rem;
      border-left: 1px solid $k-grey;
      text-align: center;
      margin-left: 0.5rem;
      padding-left: 0.5rem;
    }

    & > *:first-child label {
      border-left: 0;
      margin-left: 0;
      padding-left: 0;
    }
  }
}
</style>
