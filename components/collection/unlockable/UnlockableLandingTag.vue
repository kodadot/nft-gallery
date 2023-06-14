<template>
  <div
    v-if="isUnlockableLandingTagVisible"
    class="unlockable-landing-tag is-flex border is-justify-content-space-between px-4 mt-6 mx-4">
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

      <span> {{ $t('mint.unlockable.mintLive') }} </span>
      <NeoIcon icon="horizontal-rule" size="small" class="separator mx-2" />
    </div>

    <nuxt-link
      class="is-flex is-align-items-center has-text-weight-bold"
      to="/stmn/unlockable">
      {{ $t('mint.unlockable.takeMe') }}
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
const isUnlockableLandingTagVisible = true
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables.scss';
.unlockable-landing-tag {
  border-radius: 2rem;
  @include ktheme() {
    background-color: theme('background-color');
  }
  .separator {
    color: $placeholder-color;
    width: 15px;
    height: 2px;
    overflow: hidden;
  }
}
</style>
