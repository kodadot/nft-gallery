<template>
  <div
    v-if="!(loaded && !drops.length)"
    class="pt-6 pb-7 md:!pb-16 max-sm:mx-5 mx-12 2xl:mx-auto border-b border-neutral-5 dark:border-neutral-9 max-w-[89rem]">
    <div class="flex flex-col gap-8 w-full">
      <div
        v-if="loaded"
        class="flex flex-wrap items-center max-md:gap-2 justify-between">
        <div class="flex gap-2 items-center">
          <p class="text-xl font-bold">
            {{ $t('profiles.curatedGenerativDrops.title') }}
          </p>

          <NeoIcon icon="badge-check" pack="fass" class="text-k-accent" />
        </div>

        <NeoTooltip
          :label="$t('profiles.curatedGenerativDrops.explainHowThisWorks')"
          position="auto"
          multiline
          multiline-width="256px">
          <p class="text-neutral-7 text-sm capitalize">
            {{ $t('profiles.curatedGenerativDrops.howThisWorks') }}
          </p>
        </NeoTooltip>
      </div>

      <div v-else class="flex justify-between items-center">
        <div class="flex gap-2">
          <div class="w-[255] h-[24]">
            <NeoSkeleton width="255" height="24" :rounded="false" no-margin />
          </div>
          <div class="!w-4">
            <NeoSkeleton width="16" rounded circle no-margin />
          </div>
        </div>
        <div>
          <NeoSkeleton width="120" height="14" :rounded="false" no-margin />
        </div>
      </div>

      <DropsGrid
        :drops="drops"
        :loaded="loaded"
        :default-skeleton-count="4"
        skeleton-key="curated-drops-skeleton" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { NeoIcon, NeoSkeleton, NeoTooltip } from '@kodadot1/brick'
import { useDrops } from '@/components/drops/useDrops'

const props = defineProps<{
  id: string
}>()

const { urlPrefix } = usePrefix()

const { drops, loaded } = useDrops({
  active: [true, false],
  chain: [urlPrefix.value],
  creator: props.id,
})
</script>
