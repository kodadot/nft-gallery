<template>
  <About />
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator'
import About from '@/components/landing/About.vue'

@Component({
  components: {
    About
  }
})

export default class AboutPage extends Vue {
}
</script>
