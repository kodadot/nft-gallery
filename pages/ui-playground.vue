<script setup lang="ts">
const items = [
  'https://picsum.photos/600/800?random=1',
  'https://picsum.photos/600/800?random=2',
  'https://picsum.photos/600/800?random=3',
  'https://picsum.photos/600/800?random=4',
  'https://picsum.photos/600/800?random=5',
  'https://picsum.photos/600/800?random=6',
  'https://picsum.photos/600/800?random=7',
  'https://picsum.photos/600/800?random=8',
  'https://picsum.photos/600/800?random=9',
  'https://picsum.photos/600/800?random=10',
  'https://picsum.photos/600/800?random=11',
  'https://picsum.photos/600/800?random=12',
  'https://picsum.photos/600/800?random=13',
  'https://picsum.photos/600/800?random=14',
  'https://picsum.photos/600/800?random=15',
  'https://picsum.photos/600/800?random=16',
]

const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/',
}, {
  label: 'Navigation',
  icon: 'i-heroicons-square-3-stack-3d',
}, {
  label: 'Breadcrumb',
  icon: 'i-heroicons-link',
}]
</script>

<template>
  <div>
    <UCarousel
      v-slot="{ item }"
      :items="items"
    >
      <img
        :src="item"
        width="300"
        height="400"
        draggable="false"
      >
    </UCarousel>

    <UBreadcrumb :links="links" />

    <UChip>
      <UButton
        icon="i-heroicons-inbox"
        color="gray"
      />
    </UChip>
  </div>
</template>
