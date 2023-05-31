<template>
  <div class="unlockable-container">
    <CountdownTimer />
    <hr class="text-color my-0" />
    <div class="container is-fluid">
      <div class="is-flex columns">
        <div class="column is-6 mobile-padding">
          <CollectionInfo />
          <hr class="mb-4" />
          <UnlockableTag />
        </div>
        <div class="column is-6 pt-5 is-flex is-justify-content-center">
          <ImageSlider />
        </div>
      </div>
      <hr class="text-color my-4" />
      <div class="is-flex columns">
        <div class="column is-6">
          <img :src="unloackableBanner" alt="Unlockable" />
        </div>
        <div
          class="column is-6 is-flex is-flex-direction-column is-justify-content-center">
          <div
            class="is-flex is-align-items-center has-text-weight-bold is-size-6 mb-2">
            <svg
              class="mr-2"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 6.65137V8.65137H15.5H17V10.1514V17.1514V18.6514H15.5H4.5H3V17.1514V10.1514V8.65137H4.5H6V6.65137C6 4.46387 7.78125 2.65137 10 2.65137C11.7812 2.65137 13.2812 3.83887 13.7812 5.43262L12.375 5.90137C12.0312 4.90137 11.0938 4.15137 10 4.15137C8.59375 4.15137 7.5 5.27637 7.5 6.65137ZM4.5 17.1514H15.5V10.1514H4.5V17.1514Z"
                fill="currentColor" />
            </svg>
            How unlockable item works
          </div>
          <div>
            Figma ipsum component variant main layer. Scrolling outline pixel
            vertical figma editor object content blur. Outline move object scale
            bold stroke ima. Outline move object scale bold stroke imaOutline
            move object scale bold stroke ima
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CollectionInfo from '@/components/collection/unlockable/CollectionInfo'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag'
import CountdownTimer from '@/components/collection/unlockable/CountdownTimer'
import ImageSlider from '@/components/collection/unlockable/ImageSlider'
import unloackableBanner from '@/assets/unlockable-introduce.svg'
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.unlockable-container {
}
</style>
