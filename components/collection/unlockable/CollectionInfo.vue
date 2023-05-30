<template>
  <div
    class="is-flex is-justify-content-space-between mobile-flex-direction-column gap">
    <div class="is-flex is-flex-direction-column is-flex-grow-1 max-width">
      <HeroButtons class="is-hidden-tablet" />
      <div class="is-flex mb-2">
        <div class="mr-2">about collection</div>
      </div>
      <div class="overflow-wrap">
        <Markdown :source="visibleDescription" />
      </div>
      <NeoButton
        v-if="hasSeeAllDescriptionOption"
        class="no-shadow is-text is-underlined has-text-left p-0"
        :label="seeAllDescription ? $t('showLess') : $t('showMore')"
        @click.native="toggleSeeAllDescription" />
    </div>
    <div>
      <div class="is-flex gap mobile-flex-direction-column mobile-no-gap"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeroButtons from '@/components/collection/unlockable/HeroButtons.vue'
import { NeoButton } from '@kodadot1/brick'

const collectionInfo = ref()

const seeAllDescription = ref(false)
const DESCRIPTION_MAX_LENGTH = 210

const toggleSeeAllDescription = () => {
  seeAllDescription.value = !seeAllDescription.value
}
const source =
  'Figma ipsum component variant main layer. Scrolling outline pixel vertical figma editor object content blur. Outline move object scale bold stroke ima. Outline move object scale bold stroke imaOutline move object scale bold stroke ima Figma ipsum component variant main layer. Scrolling outline pixel vertical figma editor object content blur. Outline move object scale bold stroke ima. Outline move object scale bold stroke imaOutline move object scale bold stroke image'
const hasSeeAllDescriptionOption = computed(() => {
  return (source.length || 0) > DESCRIPTION_MAX_LENGTH
})

const visibleDescription = computed(() => {
  return (
    (!hasSeeAllDescriptionOption.value || seeAllDescription.value
      ? source
      : source?.slice(0, DESCRIPTION_MAX_LENGTH)
    )?.replaceAll('\n', '  \n') || ''
  )
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.max-width {
  max-width: 100%;
}

.gap {
  gap: 1rem;
}

@include mobile {
  .mobile-flex-direction-column {
    flex-direction: column;
  }

  .mobile-no-gap {
    gap: 0;
  }
  .max-width {
    max-width: 100%;
  }
  .overflow-wrap {
    overflow-wrap: break-word;
  }
}
</style>
