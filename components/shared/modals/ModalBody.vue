<template>
  <div class="modal-body">
    <header class="px-6 py-4 flex justify-between border-b items-center">
      <NeoSkeleton
        v-if="loading"
        rounded
        width="150"
        height="35"
        no-margin
        border-radius="4rem"
        variant="k-grey-light"
      />

      <transition name="fade">
        <slot name="header">
          <div
            v-if="!loading"
            class="modal-card-title text-base font-bold line-height"
          >
            {{ title }}
          </div>
        </slot>
      </transition>

      <NeoButton
        variant="text"
        no-shadow
        icon="xmark"
        size="medium"
        @click="onClose"
      />
    </header>

    <div
      class="relative"
      :class="[
        {
          'limit-height__scrollabe': scrollable,
          'limit-height__loading': loading,
        },
        contentClass,
      ]"
    >
      <div v-if="loading">
        <SkeletonLoader
          :title="skeletonTitle"
          class="modal-skeleton"
        >
          <template
            v-if="estimatedTime"
            #footer
          >
            <SkeletonLoaderFooterPill>
              {{ formattedEstimatedTime }}
            </SkeletonLoaderFooterPill>
          </template>
        </SkeletonLoader>
      </div>

      <div
        ref="slot"
        class="slot"
        :class="[{
          slot__loading: loading,
        }, bodyClass]"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoSkeleton } from '@kodadot1/brick'

const TITLE_DURATION_SECONDS = 4

const emits = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    title?: string
    loading?: boolean
    modalWidth?: string
    modalMaxHeight?: string
    contentClass?: string
    scrollable?: boolean
    customSkeletonTitle?: string
    estimatedTime?: number
    bodyClass?: string
  }>(),
  {
    modalWidth: '25rem',
    modalMaxWidth: '30rem',
    modalMaxHeight: '70vh',
    scrollable: true,
    contentClass: 'pt-4 pb-5 px-6',
    bodyClass: '',
  },
)

const { $i18n } = useNuxtApp()
const { estimatedTime: formattedEstimatedTime, start: startEstimatedTime }
  = useEstimatedTime()

const titles = [
  $i18n.t('general.doingSomeMagic'),
  $i18n.t('general.buildingTheExperience'),
  $i18n.t('general.finishingTouches'),
  $i18n.t('general.almostThere'),
]
const titleSeconds = ref(0)

const { pause, resume: start } = useIntervalFn(
  () => (titleSeconds.value += 1),
  1000,
  { immediate: false },
)
const titleRange = computed(() =>
  Math.floor(titleSeconds.value / TITLE_DURATION_SECONDS),
)
const skeletonTitle = computed(
  () =>
    props.customSkeletonTitle
    || titles[titleRange.value]
    || titles[titles.length - 1],
)

const onClose = () => emits('close')

watch(
  [() => props.loading, () => props.estimatedTime],
  ([loading, estimatedTime]) => {
    if (loading && Boolean(estimatedTime)) {
      startEstimatedTime(Number(estimatedTime))
    }
  },
  { immediate: true },
)

watch(
  [() => props.loading, () => props.customSkeletonTitle],
  ([loading, customTitle]) => {
    if (loading && !customTitle) {
      titleSeconds.value = 0
      start()
    }
    else {
      pause()
    }
  },
  { immediate: true },
)
</script>
