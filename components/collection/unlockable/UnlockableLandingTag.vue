<template>
  <div
    v-if="isUnlockableLandingTagVisible"
    class="unlockable-landing-tag is-flex border is-justify-content-space-between is-align-items-center px-4 mt-6"
    :class="{ 'small-size': smallWidth }">
    <div class="is-flex is-align-items-center">
      <svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="21" cy="20.5" r="6" fill="#FF7AC3" />
        <g filter="url(#filter0_f_394_6126)">
          <circle cx="21" cy="21" r="6" fill="#FF7AC3" />
        </g>
        <defs>
          <filter
            id="filter0_f_394_6126"
            x="0"
            y="0"
            width="42"
            height="42"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape" />
            <feGaussianBlur
              stdDeviation="7.5"
              result="effect1_foregroundBlur_394_6126" />
          </filter>
        </defs>
      </svg>

      <span> {{ mintLiveText }} </span>
    </div>
    <div class="separator mx-2" />
    <nuxt-link
      class="is-flex is-align-items-center has-text-weight-bold my-2"
      to="/ahk/drops/chained">
      {{ $t('mint.unlockable.takeMe') }}
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
const isUnlockableLandingTagVisible = true
const { $i18n } = useNuxtApp()

const { width } = useWindowSize()

const smallWidth = computed(() => width.value < 502)

const mintLiveText = computed(() =>
  $i18n.t(
    smallWidth.value
      ? 'mint.unlockable.mintLiveSmall'
      : 'mint.unlockable.mintLive',
  ),
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.unlockable-landing-tag {
  border-radius: 2rem;
  @include ktheme() {
    background-color: theme('background-color');
    .separator {
      background: theme('separator-line-color');
      width: 15px;
      height: 1px;
    }
  }

  &.small-size {
    flex-direction: column;
    border-radius: 1rem;
    .separator {
      width: 100%;
    }
  }
}
</style>
