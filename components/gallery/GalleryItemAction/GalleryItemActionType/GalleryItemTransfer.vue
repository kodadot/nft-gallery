<template>
  <div class="is-flex is-justify-content-space-between">
    <div>&nbsp;</div>
    <GalleryItemActionSlides ref="actionRef" :active="active">
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
    </GalleryItemActionSlides>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { onClickOutside } from '@vueuse/core'

import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'

const active = ref(false)

function toggleActive() {
  active.value = !active.value
}

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))
</script>

<style lang="scss" scoped></style>
