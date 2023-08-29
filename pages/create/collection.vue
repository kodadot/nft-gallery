<template>
  <CreateCollection />
</template>

<script lang="ts">
import CreateCollection from '@/components/create/Collection.vue'

export default {
  components: {
    CreateCollection,
  },
  layout() {
    return 'background-layout'
  },
}
</script>
