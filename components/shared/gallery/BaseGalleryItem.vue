<template>
  <section class="wrapper no-padding-desktop gallery-item">
    <slot name="top"></slot>

    <div class="columns" :class="{ 'fixed-height': isFullScreenView }">
      <div
        class="image-wrapper"
        @mouseenter="showNavigation = true"
        @mouseleave="showNavigation = false">
        <button
          id="theatre-view"
          @click="toggleView"
          v-if="!isLoading && imageVisible">
          {{ viewMode === 'default' ? $t('theatre') : $t('default') }}
          {{ $t('view') }}
        </button>
        <div
          class="column"
          :class="{
            'is-12 is-theatre': viewMode === 'theatre',
            'is-6 is-offset-3': viewMode === 'default',
          }">
          <div
            v-orientation="
              viewMode === 'default' && !isFullScreenView && imageVisible
            "
            class="image-preview has-text-centered"
            :class="{ fullscreen: isFullScreenView }">
            <img v-if="isFullScreenView" :src="image" :alt="description" />
            <BasicImage
              v-else-if="imageVisible"
              :src="image"
              :alt="description" />
            <div
              v-else
              class="media-container is-flex is-justify-content-center">
              <MediaResolver
                :src="animationUrl"
                :poster="image"
                :description="description"
                :availableAnimations="[animationUrl]"
                :mimeType="mimeType"
                class="media-item" />
            </div>
          </div>
          <slot name="image"></slot>
        </div>
        <button
          id="fullscreen-view"
          @keyup.esc="minimize"
          @click="toggleFullScreen"
          v-if="!isLoading && imageVisible"
          :class="{ fullscreen: isFullScreenView }">
          <b-icon :icon="isFullScreenView ? 'compress-alt' : 'arrows-alt'">
          </b-icon>
        </button>
      </div>
    </div>

    <slot name="main"></slot>

    <slot name="footer"></slot>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Orientation from '@/utils/directives/DeviceOrientation'

const components = {
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
}

const directives = {
  orientation: Orientation,
}

@Component({ components, directives })
export default class BaseGalleryItem extends Vue {
  @Prop({ type: String, default: '/placeholder.svg' }) public image!: string
  @Prop(String) public animationUrl!: string
  @Prop({ type: String, default: 'KodaDot NFT minted multimedia' })
  public description!: string
  @Prop(Boolean) public imageVisible!: boolean
  @Prop(Boolean) public isLoading!: boolean
  @Prop(String) public mimeType!: string

  private isFullScreenView = false
  private viewMode = this.$store.getters['preferences/getTheatreView']

  public toggleView(): void {
    this.viewMode = this.viewMode === 'default' ? 'theatre' : 'default'
  }

  public setFullScreenView(value: boolean) {
    this.isFullScreenView = value
  }

  public toggleFullScreen(): void {
    this.setFullScreenView(!this.isFullScreenView)
  }

  public minimize(): void {
    this.setFullScreenView(false)
  }

  public onImageError(e: any) {
    console.warn('Image error', e)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.fixed-height {
  height: 748px;
}

.gallery-item {
  .image-wrapper {
    position: relative;
    margin: 30px auto;
    width: 100%;

    .image {
      border: 2px solid $primary;
    }

    .fullscreen-image {
      display: none;
    }

    .image-preview {
      .media-container {
        position: relative;
        padding-top: 100%;
        .media-item {
          position: absolute;
          top: 0;
          height: 100%;
        }
      }
      &.fullscreen {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 999998;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .column {
      transition: 0.3s all;
    }

    button {
      border: 2px solid $primary;
      color: #fff;
      font-weight: bold;
      text-transform: uppercase;
      padding: 7px 16px;
      font-size: 20px;
      background: $scheme-main;
      z-index: 2;

      &:hover {
        background: $primary;
        cursor: pointer;
      }
    }
  }

  button#theatre-view {
    position: absolute;
    top: 13px;
    left: 13px;
    color: $light-text;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  button#fullscreen-view {
    position: absolute;
    bottom: 13px;
    right: 13px;

    &.fullscreen {
      position: fixed;
      z-index: 999998;
      bottom: 0;
      right: 0;
    }
  }

  .price-block {
    border: 2px solid $primary;
    padding: 14px;

    &__original {
      font-size: 24px;
      text-transform: uppercase;
      font-weight: 500;
    }

    &__container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__exchange {
      opacity: 0.6;
      color: $dark;
      margin: 0;
    }
  }

  &.no-padding-desktop {
    @media screen and (min-width: 1023px) {
      padding: 0;
    }
  }
}
</style>
