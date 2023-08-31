<template>
  <CreateCollection />
</template>

<script lang="ts">
import CreateCollection from '@/components/create/CreateCollection.vue'

export default {
  components: {
    CreateCollection,
  },
  layout() {
    return 'background-layout'
  },
}
</script>
