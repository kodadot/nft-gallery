<template>
  <Faq />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Faq from '@/components/rmrk/Faq.vue'

@Component({
  components: {
    Faq
  }
})

export default class FaqePage extends Vue {
}
</script>
