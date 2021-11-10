<template>
  <PermaMint />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import PermaMint from '@/components/rmrk/Create/PermaMint.vue'

@Component({
  components: {
    PermaMint
  }
})

export default class PermaMintPage extends Vue {
}
</script>
