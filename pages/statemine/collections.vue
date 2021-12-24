<template>
  <Collections />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Collections from '@/components/rmrk/Gallery/Collections.vue'

@Component({
  components: {
    Collections
  }
})

export default class CollectionsPage extends Vue {
}
</script>
