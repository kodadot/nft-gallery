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
        variant="k-grey-light" />

      <transition name="fade">
        <div
          v-if="!loading"
          class="modal-card-title text-base font-bold line-height">
          {{ title }}
        </div>
      </transition>

      <NeoButton
        variant="text"
        no-shadow
        icon="xmark"
        size="medium"
        @click="onClose" />
    </header>

    <div
      class="modal-body-content"
      :class="{
        [contentClass]: !loading,
        'modal-body-content__scrollable': scrollable && !loading,
        'modal-body-content__loading': loading,
      }">
      <SkeletonLoader v-if="loading" :title="skeletonTitle" />

      <div
        :class="{
          'opacity-0 z-[1] pointer-events-none': loading,
        }">
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
    title: string
    loading?: boolean
    modalWidth?: string
    contentClass?: string
    scrollable?: boolean
    customSkeletonTitle?: string
  }>(),
  {
    modalWidth: '25rem',
    scrollable: true,
    contentClass: 'pt-4 pb-5 px-6',
  },
)

const { $i18n } = useNuxtApp()

const titles = [
  $i18n.t('general.doingSomeMagic'),
  $i18n.t('general.buildingTheExperience'),
  $i18n.t('general.finishingTouches'),
  $i18n.t('general.almostThere'),
]
const seconds = ref(0)

const { pause, resume: start } = useIntervalFn(
  () => (seconds.value += 1),
  1000,
  { immediate: false },
)
const titleRange = computed(() =>
  Math.floor(seconds.value / TITLE_DURATION_SECONDS),
)
const skeletonTitle = computed(
  () =>
    props.customSkeletonTitle ||
    titles[titleRange.value] ||
    titles[titles.length - 1],
)

const onClose = () => emits('close')

watch(
  [() => props.loading, () => props.customSkeletonTitle],
  ([loading, customTitle]) => {
    if (loading && !customTitle) {
      seconds.value = 0
      start()
    } else {
      pause()
    }
  },
  { immediate: true },
)
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

$px: 2rem;
$pt: 1.5rem;
$pb: 1.25rem;
$header-height: 68px;

/* NeoModal overflow */
.o-modal__content:has(.modal-body) {
  overflow-y: hidden !important;
}

.modal-body {
  height: 100%;
  width: v-bind(modalWidth);

  @include mobile {
    width: unset;
  }

  &-content {
    height: calc(100% - $header-height);

    &__scrollable {
      overflow-y: auto;
    }

    &__loading {
      overflow-y: unset;
      position: relative;
      margin-top: $pt;
      margin-left: $px;
      width: calc(100% - $px * 2);
      height: calc(100% - $header-height - ($pt + $pb));
    }
  }
}

.line-height {
  line-height: 2.1875rem;
}
</style>
