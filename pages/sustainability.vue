<template>
  <Sustainability />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Sustainability from '@/components/landing/Sustainability.vue'

@Component({
  components: {
    Sustainability
  }
})

export default class SustainabilityPage extends Vue {
}
</script>
