<template>
  <Landing prefix="statemine" />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    Landing: () => import('@/components/landing/Landing.vue')
  }
})

export default class LandingPage extends Vue {
}
</script>
