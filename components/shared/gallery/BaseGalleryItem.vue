<template>
  <section class="wrapper no-padding-desktop gallery-item">
    <slot name="top"></slot>

    <div class="columns" :class="{ 'fixed-height': isFullScreenView }">
      <div
        class="image-wrapper"
        @mouseenter="$emit('mouseEntered')"
        @mouseleave="$emit('mouseLeft')">
        <div
          class="column column-padding"
          :class="{
            'is-12 is-theatre': viewMode === 'theatre',
            'is-6 is-offset-3': viewMode === 'default',
          }">
          <div
            v-orientation="
              viewMode === 'default' &&
              !isFullScreenView &&
              !isTileView &&
              imageVisible &&
              isGyroEffectEnabled
            "
            class="image-preview has-text-centered"
            :class="{
              fullscreen: isFullScreenView,
              tile: isTileView,
            }">
            <img
              v-if="isFullScreenView"
              :src="image"
              :alt="description"
              @contextmenu.prevent />
            <BasicImage
              v-else-if="imageVisible"
              :src="image"
              :alt="description"
              @contextmenu.native.prevent />
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
            <div
              id="tile-placeholder"
              v-show="isTileView"
              :style="{ 'background-image': 'url(' + image + ')' }"
              :alt="description"
              @click="exitTileView"
              @contextmenu.prevent />
          </div>
          <slot name="image"></slot>
        </div>
        <button
          id="theatre-view"
          @click="toggleView"
          v-if="!isLoading && imageVisible">
          <b-icon :icon="viewMode === 'default' ? 'image' : 'cube'"> </b-icon>
        </button>
        <button
          id="fullscreen-view"
          @keyup.esc="minimize"
          @click="toggleFullScreen"
          v-if="!isLoading && imageVisible"
          :class="{ fullscreen: isFullScreenView }">
          <b-icon :icon="isFullScreenView ? 'compress' : 'expand'"> </b-icon>
        </button>
        <button
          id="tile-view"
          @click="toggleTileView"
          @keyup.esc="exitTileView"
          v-if="!isLoading && imageVisible"
          :class="{ tile: isTileView }">
          <b-icon :icon="isTileView ? 'compress' : 'table'"> </b-icon>
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
import { isMobileDevice } from '~/utils/extension'

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
  private isTileView = false
  private viewMode = isMobileDevice
    ? 'theater'
    : this.$store.getters['preferences/getTheatreView']

  get isGyroEffectEnabled(): boolean {
    if (isMobileDevice) {
      return true
    }
    return this.$store.getters['preferences/getEnableGyroEffect']
  }

  public toggleView(): void {
    this.viewMode = this.viewMode === 'default' ? 'theatre' : 'default'
  }

  public toggleTileView(): void {
    this.setTileView(!this.isTileView)
  }

  public setTileView(value: boolean) {
    this.isTileView = value
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
  public exitTileView(): void {
    this.setTileView(false)
  }

  public onImageError(e: any) {
    this.$consola.warn('Image error', e)
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.gallery-item {
  .fixed-height {
    height: 748px;
  }

  .image-wrapper {
    position: relative;
    margin: 30px auto;
    width: 100%;

    .fullscreen-image {
      display: none;
    }

    .image-preview {
      img {
        object-fit: contain;
        height: 100%;
      }
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
      &.tile {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 999998;
        background: #000;
        div#tile-placeholder {
          background-repeat: repeat;
          background-position: center;
          background-size: 33.33%;
          width: 100%;
          height: 100%;
        }
      }
    }

    .column {
      transition: 0.3s all;
    }

    button {
      border: 0;
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
    bottom: 12px;
    right: 124px;
    color: $light-text;
    opacity: 0.6;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  button#fullscreen-view {
    position: absolute;
    bottom: 12px;
    right: 68px;
    opacity: 0.6;
    &.fullscreen {
      position: fixed;
      z-index: 999998;
      bottom: 0;
      right: 0;
    }
    @media screen and (max-width: 768px) {
      right: -12px;
    }
  }

  button#tile-view {
    position: absolute;
    bottom: 12px;
    right: 12px;
    opacity: 0.6;
    &.tile {
      position: fixed;
      z-index: 999998;
      bottom: 0;
      right: 0;
    }
    @media screen and (max-width: 768px) {
      display: none;
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
