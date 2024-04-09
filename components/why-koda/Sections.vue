<template>
  <section>
    <div class="section-container">
      <div
        v-for="(section, index) in sections"
        :id="section.id"
        :key="section.id"
        class="py-14 md:py-[5.5rem] border-k-shade2"
        :class="{
          'border-b': hasBlock && index !== sections.length - 1,
          'last:pb-0': hasBlock,
        }">
        <WhyKodaSectionItem :section="section" />
      </div>
    </div>

    <div>
      <div
        v-if="galleryImages"
        class="flex gap-4 max-md:pb-14 max-md:pt-6 md:py-20 justify-center">
        <div
          v-for="img in galleryImages"
          :key="img"
          class="h-[216px] min-w-[291px] md:h-[358px] md:min-w-[480px] shadow-primary border rounded-xl overflow-hidden">
          <BasicImage :src="img" alt="offline_exhibitions" />
        </div>
      </div>

      <div v-if="tags" class="section-container pb-20 border-b border-k-shade2">
        <p class="text-xl md:text-2xl">{{ $t('benefits') }}:</p>
        <div class="flex gap-4 flex-wrap !mt-4">
          <div v-for="tag in tags" :key="tag">
            <span class="border rounded-full px-2 text-xl md:text-2xl">
              {{ $t(`whyKoda.benefits.${tag}`) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import type { Section } from './types'

const props = defineProps<{
  sections: Section[]
}>()

const nextBlockIndex = computed(() =>
  props.sections.findIndex((section) =>
    Boolean(section.images || section.tags),
  ),
)

const hasBlock = computed(() => nextBlockIndex.value > 0)

const galleryImages = computed(() =>
  nextBlockIndex.value
    ? props.sections[nextBlockIndex.value]?.images
    : undefined,
)

const tags = computed(() =>
  nextBlockIndex.value ? props.sections[nextBlockIndex.value]?.tags : undefined,
)
</script>
<style lang="scss" scoped>
.section-container {
  @apply container mx-auto max-md:px-4;
}
</style>
