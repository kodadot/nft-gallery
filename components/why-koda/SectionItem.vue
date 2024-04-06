<template>
  <div>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-2">
        <NeoButton rounded tag="a" :href="`#${section.id}`">
          {{ section.number }}.
        </NeoButton>
      </div>
      <p
        class="text-3xl md:text-6xl font-bold text-center capitalize md:inline text-start col-span-5">
        {{ section.name }}
      </p>
      <p class="col-span-5">{{ section.description }}</p>
    </div>

    <slot />
  </div>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { Section } from '@/pages/why-koda.vue'

defineProps<{ section: Section }>()
</script>
