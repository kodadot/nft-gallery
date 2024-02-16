<template>
  <div :class="`w-[unset] md:w-[${modalWidth}] md:max-w-[${modalMaxWidth}]`">
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
          :class="`leading-[2.1875rem]`"
          class="modal-card-title text-base font-bold">
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
      class="relative"
      :class="[
        contentClass,
        scrollable ? `max-h-[${modalMaxWidth}] overflow-y-auto` : '',
        loading ? `max-h-[${modalMaxWidth}] overflow-hidden` : '',
      ]">
      <div v-if="loading">
        <SkeletonLoader :title="skeletonTitle" class="modal-skeleton" />
      </div>

      <div
        ref="slot"
        class="slot"
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
    modalMaxWidth?: string
    modalMaxHeight?: string
    contentClass?: string
    scrollable?: boolean
    customSkeletonTitle?: string
  }>(),
  {
    modalWidth: '25rem',
    modalMaxWidth: '30rem',
    modalMaxHeight: '70vh',
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
$x-padding: 2rem;
$t-padding: 1.5rem;
$b-padding: 1.25rem;

.modal-skeleton {
  position: unset !important;
  #skeleton-backdrop {
    top: $t-padding;
    left: $x-padding;
    width: calc(100% - $x-padding * 2);
    height: calc(100% - ($t-padding + $b-padding));
    max-height: v-bind(modalMaxHeight) !important;
  }
}
</style>
