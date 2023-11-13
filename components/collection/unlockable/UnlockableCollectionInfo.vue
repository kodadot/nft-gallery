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
        <div v-else />

        <nuxt-link :to="`/${urlPrefix}/collection/${collectionId}`">
          <NeoButton
            variant="secondary"
            tag="span"
            target="_blank"
            class="has-text-left is-flex is-align-items-center">
            <span>View Collection</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.41708 6.95833L0.95875 6.95833L0.95875 6.04167L1.41708 6.04167L1.41708 6.95833ZM10.9078 6.1759C11.0868 6.35489 11.0868 6.64509 10.9078 6.82408L7.99103 9.7409C7.81204 9.91989 7.52183 9.91989 7.34284 9.7409C7.16385 9.56191 7.16385 9.27171 7.34284 9.09272L9.93557 6.49999L7.34284 3.90727C7.16385 3.72828 7.16385 3.43808 7.34284 3.25909C7.52183 3.0801 7.81204 3.0801 7.99103 3.25909L10.9078 6.1759ZM1.41708 6.04167L10.5838 6.04166L10.5838 6.95833L1.41708 6.95833L1.41708 6.04167Z"
                fill="currentColor" />
            </svg>
          </NeoButton>
        </nuxt-link>
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
