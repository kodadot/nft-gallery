<template>
  <div
    class="is-flex is-justify-content-space-between mobile-flex-direction-column">
    <div class="is-flex is-flex-direction-column is-flex-grow-1 max-width">
      <div class="is-flex mt-6 is-justify-content-space-between mb-2">
        <div class="mr-2 has-text-weight-bold is-size-5 mb-1">
          About Collection
        </div>
        <HeroButtons class="is-hidden-tablet" />
      </div>
      <div class="overflow-wrap">
        <Markdown :source="visibleDescription" />
      </div>
      <div
        class="is-flex is-justify-content-space-between is-align-items-center">
        <NeoButton
          v-if="hasSeeAllDescriptionOption"
          class="no-shadow is-text has-text-left p-0 is-underlined"
          :label="seeAllDescription ? $t('showLess') : $t('showMore')"
          @click="toggleSeeAllDescription" />
        <NeoButton
          variant="secondary"
          rounded
          :tag="NuxtLink"
          :to="`/${urlPrefix}/collection/${collectionId}`"
          target="_self"
          icon="arrow-right">
          <span>View Collection</span>
        </NeoButton>
      </div>
    </div>
    <div>
      <div class="is-flex gap mobile-flex-direction-column mobile-no-gap"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeroButtons from '@/components/collection/unlockable/UnlockableHeroButtons.vue'
import Markdown from '@/components/shared/Markdown.vue'
import { NeoButton } from '@kodadot1/brick'
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')
const props = defineProps<{ collectionId: string; description?: string }>()

const seeAllDescription = ref(false)
const DESCRIPTION_MAX_LENGTH = 210
const { urlPrefix } = usePrefix()
const toggleSeeAllDescription = () => {
  seeAllDescription.value = !seeAllDescription.value
}
const source = computed(() => {
  return props.description
})
const hasSeeAllDescriptionOption = computed(() => {
  return (source.value?.length || 0) > DESCRIPTION_MAX_LENGTH
})

const visibleDescription = computed(() => {
  return (
    (!hasSeeAllDescriptionOption.value || seeAllDescription.value
      ? source.value
      : source.value?.slice(0, DESCRIPTION_MAX_LENGTH)
    )?.replaceAll('\n', '  \n') || ''
  )
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
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
