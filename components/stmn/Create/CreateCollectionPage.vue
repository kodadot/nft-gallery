<template>
  <div class="mb-8">
    <CreateCollection @created="onCollectionCreated" />
  </div>
</template>

<script lang="ts" setup>
const CreateCollection = defineAsyncComponent(
  () => import('./CreateCollection.vue')
)

const emit = defineEmits(['navigateToCreateNftTab'])

const onCollectionCreated = () => {
  emit('navigateToCreateNftTab')
}
</script>
