<template>
  <Identity />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Identity from '@/components/rmrk/Profile/IdentityForm.vue'

@Component({
  components: {
    Identity,
  },
})
export default class IdentityPage extends Vue {
  layout() {
    return 'centered-half-layout'
  }
}
</script>
