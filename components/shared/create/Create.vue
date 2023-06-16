<template>
  <div class="mb-8">
    <CreateCollection
      :show-collection-id="showCollectionId"
      @created="onCollectionCreated" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue'
import CreateCollection from './CreateCollection.vue'
const { urlPrefix } = usePrefix()

const showCollectionId = computed(
  () => urlPrefix.value !== 'stmn' && urlPrefix.value !== 'stt'
)

const emit = defineEmits(['navigateToCreateNftTab'])

const onCollectionCreated = () => {
  emit('navigateToCreateNftTab')
}
</script>
