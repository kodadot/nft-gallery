<template>
  <div class="is-flex is-justify-content-space-between">
    <div>&nbsp;</div>
    <GalleryItemPriceAction :active="active">
      <template #action>
        <NeoButton
          label="Transfer"
          size="large"
          fixed-width
          no-shadow
          @click.native="toggleActive" />
      </template>

      <template #content>
        <div>
          <input type="number" placeholder="Transfer To:" />
        </div>
      </template>
    </GalleryItemPriceAction>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

import GalleryItemPriceAction from '../GalleryItemActionCta.vue'

const active = ref(false)

function toggleActive() {
  active.value = !active.value
}
</script>

<style lang="scss" scoped></style>
