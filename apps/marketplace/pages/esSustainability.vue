<template>
  <EsSustainability />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import EsSustainability from '@/components/landing/EsSustainability.vue'

@Component({
  components: {
    EsSustainability,
  },
})
export default class EsSustainabilityPage extends Vue {}
</script>
