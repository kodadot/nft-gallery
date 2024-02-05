<template>
  <div>
    <nuxt-link
      data-testid="classic"
      :to="`/${urlPrefix}/create`"
      class="navbar-item"
      @click="emit('select')">
      {{ $t('create') }}
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  chain: string
}>()
const emit = defineEmits(['select'])

const { urlPrefix } = usePrefix()
</script>
