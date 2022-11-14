<template>
  <Teleport />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    Teleport: () => import('@/components/teleport/Teleport.vue'),
  },
})
export default class TeleportBridge extends Vue {}
</script>
