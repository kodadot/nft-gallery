<template>
  <div class="mb-6">
    <CreateCollection @created="onCollectionCreated" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateCollection from './CreateCollection.vue'

@Component({
  components: {
    CreateCollection,
  },
})
export default class Create extends Vue {
  onCollectionCreated() {
    this.$emit('navigateToCreateNftTab')
  }
}
</script>
