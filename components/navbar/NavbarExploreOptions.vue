<template>
  <div>
    <div class="is-flex is-flex-wrap-nowrap">
      <nuxt-link
        :to="`/${urlPrefix}/explore/items`"
        class="menu-item mr-2"
        data-cy="explore-items"
        @click.native="emit('closeMobileNavbar')">
        {{ $t('items') }}
      </nuxt-link>
      <nuxt-link
        :to="`/${urlPrefix}/explore/collectibles`"
        class="menu-item mr-2"
        @click.native="emit('closeMobileNavbar')">
        {{ $t('collections') }}
      </nuxt-link>
      <span class="menu-item is-disabled">
        {{ $t('users') }}
        <span class="small-size-text">
          {{ $t('soon') }}
        </span>
      </span>
    </div>

    <hr aria-role="menuitem" class="dropdown-divider my-4" />
    <div>
      <span
        v-for="option in filteredChains"
        :key="option.value"
        class="menu-item mr-2 is-white-space-nowrap"
        :value="option.value"
        @click="setSelectedChain(option.value)">
        {{ option.text }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { urlPrefix, setUrlPrefix } = usePrefix()
const { availableChains } = useChain()

const emit = defineEmits(['closeMobileNavbar'])

const filteredChains = computed(() => {
  return ['ahk', 'ahp', 'ksm']
    .map((prefix) =>
      availableChains?.value.find((chain) => chain.value === prefix)
    )
    .filter(Boolean)
})

const setSelectedChain = (value) => {
  setUrlPrefix(value)
  navigateTo(`/${value}/explore/collectibles`)
}
</script>
