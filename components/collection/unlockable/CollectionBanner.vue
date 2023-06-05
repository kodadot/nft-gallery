<template>
  <div
    class="collection-banner"
    :style="{ backgroundImage: `url(${unloackableBanner})` }">
    <div class="collection-banner-shadow"></div>

    <section class="h-full py-8">
      <div class="container is-fluid collection-banner-content">
        <div class="is-flex is-flex-direction-column is-align-items-start">
          <div class="collection-banner-avatar">
            <img
              src="https://replicate.delivery/pbxt/Cxfhi4qeTNvn6kcrrKlvL1YUPBKeAmbNrrf2ATtPVd6o5gDEB/out-1.png"
              alt="avatar" />
          </div>
          <h1 class="collection-banner-name">Waifu T-Shirt Free Mint</h1>
        </div>
        <HeroButtons class="is-hidden-mobile is-align-self-flex-end" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeroButtons from '@/components/collection/unlockable/HeroButtons.vue'
import unloackableBanner from '@/assets/unlockable-banner.svg'
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.collection-banner {
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

  @include desktop {
    height: 560px;
  }

  @include ktheme() {
    border-bottom: 1px solid theme('border-color');
  }

  &-shadow {
    background: linear-gradient(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.2));
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 100%;

    @include mobile {
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
    }
  }

  &-avatar {
    padding: 0.75rem;

    @include ktheme() {
      border: 1px solid theme('border-color');
      background-color: theme('background-color');
      box-shadow: theme('primary-shadow');
    }

    img {
      display: block;
      width: 5.5rem;
      height: 5.5rem;
      border: 1px solid;
    }
  }

  &-name {
    font-weight: bold;
    font-size: 2rem;
    margin-top: 1.5rem;

    @include ktheme() {
      color: theme('text-color-inverse');
      text-shadow: 1px 1px 0 theme('text-color'), 1px -1px 0 theme('text-color'),
        -1px 1px 0 theme('text-color'), -1px -1px 0 theme('text-color'),
        1px 0px 0 theme('text-color'), 0px 1px 0 theme('text-color'),
        -1px 0px 0 theme('text-color'), 0px -1px 0 theme('text-color'),
        4px 4px theme('text-color');
    }
  }
}
</style>
