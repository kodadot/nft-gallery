<template>
  <div class="flex flex-nowrap">
    <nuxt-link
      :to="`/${urlPrefix}/explore/items`"
      class="menu-item mr-6"
      data-testid="explore-items"
      @click="emitSelect"
    >
      {{ $t('items') }}
    </nuxt-link>
    <nuxt-link
      :to="`/${urlPrefix}/explore/collectibles`"
      class="menu-item mr-6"
      @click="emitSelect"
    >
      {{ $t('collections') }}
    </nuxt-link>
    <span class="menu-item is-disabled text-k-shade text-nowrap">
      {{ $t('users') }}
      <span class="text-vertical-align-top text-xs">
        {{ $t('soon') }}
      </span>
    </span>
  </div>
</template>

<script lang="ts" setup>
const { urlPrefix } = usePrefix()

const emit = defineEmits(['select'])

const emitSelect = () => {
  emit('select')
}
</script>
