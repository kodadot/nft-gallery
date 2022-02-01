<template>
  <EsCarbonless />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import EsCarbonless from '@/components/landing/EsCarbonless.vue'

@Component({
  components: {
    EsCarbonless,
  },
})
export default class EsCarbonlessPage extends Vue {}
</script>
