<template>
  <div>
    <div class="max-md:flex max-md:flex-col md:grid md:grid-cols-12 md:gap-4">
      <div class="md:col-span-2">
        <NeoButton
          v-safe-href="`#${section.id}`"
          rounded
          tag="a"
          class="!border !border-border-color hover:!bg-background-color">
          {{ section.number }}.
        </NeoButton>
      </div>
      <p
        class="text-3xl lg:text-6xl font-bold text-center capitalize md:inline text-start md:col-span-5 max-md:mt-8">
        {{ section.name }}
      </p>
      <p class="md:col-span-5 max-md:mt-6 text-xl">{{ section.description }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { Section } from '@/pages/why-koda.vue'

defineProps<{ section: Section }>()
</script>
