<template>
  <div>
    <nuxt-link :to="`/${urlPrefix}/explore?tab=GALLERY`" class="menu-item mr-2">
      {{ $t('gallery') }}
    </nuxt-link>
    <nuxt-link
      :to="`/${urlPrefix}/explore?tab=COLLECTION`"
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
      v-for="option in options.slice(0, 3)"
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
import { getChainTestList } from '~/utils/constants'

const { $store, $config, $router } = useNuxtApp()
const { urlPrefix } = usePrefix()

const options = computed(() => {
  const availableUrlPrefixes = $store.getters['availableUrlPrefixes']

  if (!$config.dev) {
    return availableUrlPrefixes.filter(
      (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
    )
  }
  return availableUrlPrefixes
})

const selectedChain = $store.getters.getSettings['urlPrefix']

const setSelectedChain = (value) => {
  $store.dispatch('setUrlPrefix', value)
  $router.push({ path: `/${value}` })
}
</script>
