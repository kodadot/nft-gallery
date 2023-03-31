<template>
  <div>
    <nuxt-link :to="`/${urlPrefix}/explore/items`" class="menu-item mr-2">
      {{ $t('items') }}
    </nuxt-link>
    <nuxt-link
      :to="`/${urlPrefix}/explore/collectibles`"
      class="menu-item mr-2">
      {{ $t('collections') }}
    </nuxt-link>
    <span class="menu-item is-disabled">
      {{ $t('users') }}
      <span class="small-size-text">
        {{ $t('soon') }}
      </span>
    </span>
    <hr aria-role="menuitem" class="dropdown-divider my-4" />
    <span
      v-for="option in availableChains.slice(0, 3)"
      :key="option.value"
      :class="[
        'menu-item',
        'mr-2',
        { 'is-active': selectedChain === option.value },
      ]"
      :value="option.value"
      @click="setSelectedChain(option.value)">
      {{ option.text }}
    </span>
  </div>
</template>

<script lang="ts" setup>
const { $store, $router } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { availableChains } = useChain()

const selectedChain = $store.getters.getSettings['urlPrefix']

const setSelectedChain = (value) => {
  $store.dispatch('setUrlPrefix', value)
  $router.push({ path: `/${value}` })
}
</script>
