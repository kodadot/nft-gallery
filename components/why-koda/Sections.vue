<template>
  <section class="px-[96px] md:container md:mx-auto">
    <div
      v-for="section in sections"
      :id="section.id"
      :key="section.id"
      class="py-[5.5rem]"
      :class="{ 'border-b': section.id !== 'offline_exhibitions' }">
      <WhyKodaSectionItem :section="section">
        <template v-if="section.id === 'offline_exhibitions'"> </template>
      </WhyKodaSectionItem>
    </div>
  </section>
</template>
<script lang="ts" setup>
defineProps<{
  sections: { name: string; id: string; description: string; number: number }[]
}>()
</script>
