<template>
  <Teleport />
</template>

<script lang="ts">
import Teleport from '@/components/teleport/Teleport.vue'

export default {
  name: 'TeleportPage',
  components: {
    Teleport,
  },
  setup() {
    useHead({
      title: 'Teleport',
      meta: [
        {
          name: 'description',
          content: 'Teleport your assets between chains',
        },
      ],
    })
  },
}
</script>
