<template>
  <div class="mb-6">
    <CreateCollection />
  </div>
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import CreateCollection from './CreateCollection.vue'

@Component({
  components: {
    CreateCollection
  }
})
export default class Create extends Vue {
}
</script>
