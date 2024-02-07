<template>
  <div class="flex justify-between mobile-flex-direction-column">
    <div class="flex flex-col flex-grow max-width">
      <div class="flex justify-between mb-2">
        <div class="mr-2 font-bold text-xl mb-1">About Collection</div>
      </div>
      <div class="overflow-wrap">
        <Markdown :source="visibleDescription" />
      </div>
      <div class="flex justify-between items-center">
        <NeoButton
          v-if="hasSeeAllDescriptionOption"
          class="no-shadow is-text text-left p-0"
          :label="seeAllDescription ? $t('showLess') : $t('showMore')"
          @click="toggleSeeAllDescription" />
        <NeoButton
          variant="outlined-rounded"
          rounded
          :tag="NuxtLink"
          :to="`/${urlPrefix}/collection/${collectionId}`"
          icon="arrow-right">
          <span>View Collection</span>
        </NeoButton>
      </div>
    </div>
    <div>
      <div class="flex gap mobile-flex-direction-column mobile-no-gap"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
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
