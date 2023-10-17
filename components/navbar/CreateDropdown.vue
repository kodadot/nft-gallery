<template>
  <div>
    <nuxt-link
      data-testid="classic"
      :to="`/${urlPrefix}/create`"
      class="navbar-item">
      {{ $t('create') }}
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  chain: string
  isMobile: boolean
}>()

const { urlPrefix } = usePrefix()
</script>
