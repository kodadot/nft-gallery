<template>
  <div>
    <CountdownTimer />
    <hr class="text-color my-0" />
    <div class="container is-fluid">
      <div class="is-flex columns">
        <div class="column is-6 mobile-padding">
          <CollectionInfo />
          <hr class="mb-4" />
          <UnlockableTag />
        </div>
        <div class="column is-6"></div>
      </div>
      <hr class="text-color my-0" />
      <div class="is-flex columns">
        <div class="column is-6">
          <img :src="unloackableBanner" alt="Unlockable" />
        </div>
        <div class="column is-6">
          <div>How unlockable item works</div>
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
import unloackableBanner from '@/assets/unlockable-introduce.svg'
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';
</style>
