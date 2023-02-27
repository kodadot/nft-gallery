<template>
  <Items v-if="redesign" />
  <ProfileDetail v-else />
</template>

<script lang="ts">
import Items from '@/components/items/Items.vue'

export default {
  components: {
    Items,
  },
  layout(context) {
    return context.query.redesign === 'true' ? 'explore-layout' : 'default'
  },
  setup() {
    const { redesign } = useExperiments()

    return {
      redesign,
    }
  },
}
</script>
