<template>
  <Spotlight />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Spotlight from '@/components/landing/Spotlight.vue'

@Component({
  components: {
    Spotlight
  }
})

export default class SpotlightPage extends Vue {
}
</script>
