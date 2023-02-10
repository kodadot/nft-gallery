<template>
  <div>
    <b-field>
      <p class="control">
        <NeoButton
          icon-left="th-large"
          :active="gridLayoutSize === smallGridLayout"
          @click.native="changeGridLayout(smallGridLayout)" />
      </p>
      <p class="control">
        <NeoButton
          icon-left="th"
          :active="gridLayoutSize === largeGridLayout"
          @click.native="changeGridLayout(largeGridLayout)" />
      </p>
    </b-field>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const { $store } = useNuxtApp()

const gridLayoutSize = computed(
  () => $store.getters['preferences/getLayoutClass']
)
const smallGridLayout = ref('is-half-desktop is-half-tablet')
const largeGridLayout = ref('is-one-quarter-desktop is-one-third-tablet')

const changeGridLayout = (layout: string) => {
  $store.dispatch('preferences/setLayoutClass', layout)
}
</script>
