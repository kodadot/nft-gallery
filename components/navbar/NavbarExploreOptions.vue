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
    <div>
      <span
        v-for="option in filteredChains"
        :key="option.value"
        class="menu-item mr-2"
        :value="option.value"
        @click="setSelectedChain(option.value)">
        {{ option.text }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { $router } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { availableChains } = useChain()

const filteredChains = computed(() => {
  return availableChains?.value.filter((chain) => {
    return ['ksm', 'bsx', 'rmrk'].includes(chain.value)
  })
})

const setSelectedChain = (value) => {
  $router.push({ path: `/${value}/explore` })
}
</script>
