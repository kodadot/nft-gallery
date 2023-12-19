<template>
  <div>
    <div class="flex flex-nowrap">
      <nuxt-link
        :to="`/${urlPrefix}/explore/items`"
        class="menu-item mr-6"
        data-testid="explore-items"
        @click="emitClose">
        {{ $t('items') }}
      </nuxt-link>
      <nuxt-link
        :to="`/${urlPrefix}/explore/collectibles`"
        class="menu-item mr-6"
        @click="emitClose">
        {{ $t('collections') }}
      </nuxt-link>
      <span class="menu-item is-disabled has-text-k-shade">
        {{ $t('users') }}
        <span class="text-vertical-align-top is-size-7">
          {{ $t('soon') }}
        </span>
      </span>
    </div>

    <hr aria-role="menuitem" class="dropdown-divider my-4" />
    <div class="flex">
      <span
        v-for="option in filteredChains"
        :key="option.value"
        class="menu-item mr-4 is-capitalized no-wrap"
        :value="option.value"
        @click="setSelectedChain(option.value)">
        {{ option.text }}
        <span
          v-if="option.isBeta"
          class="text-vertical-align-top has-text-k-shade is-size-7">
          {{ $t('beta') }}
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { urlPrefix, setUrlPrefix } = usePrefix()
const { availableChains } = useChain()

const emit = defineEmits(['closeMobileNavbar', 'closeMobileSubMenu'])

const prefixToExploreOptionName = {
  ahk: 'KusamaHub',
  ahp: 'PolkadotHub',
  ksm: 'RMRK2',
}
const filteredChains = computed(() => {
  return ['ahk', 'ahp', 'ksm']
    .map(
      (prefix) =>
        availableChains?.value.find((chain) => chain.value === prefix),
    )
    .filter(Boolean)
    .map((option) => ({
      value: option!.value,
      text: prefixToExploreOptionName[option!.value],
      isBeta: option?.text.toLowerCase().includes('beta'),
    }))
})

const emitClose = () => {
  emit('closeMobileNavbar')
  emit('closeMobileSubMenu')
}
const setSelectedChain = (value) => {
  setUrlPrefix(value)
  emitClose()
  navigateTo(`/${value}/explore/collectibles`)
}
</script>
