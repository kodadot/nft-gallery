<template>
  <Story :layout="{ type: 'single' }">
    <Variant>
      <div :style="{ padding: '3rem' }">
        <o-tabs
          v-model="activeTab"
          expanded
          content-class="o-tabs__content--fixed">
          <DisablableTab
            disabled
            value="0"
            label="Disabled"
            disabled-tooltip="Not Available" />
          <DisablableTab value="1" label="Enabled">
            <div>
              {{ tabContent }}
            </div>
          </DisablableTab>
        </o-tabs>
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import DisablableTab from './DisablableTab.vue'
import { OTabs } from '@oruga-ui/oruga'
import { ref } from 'vue'

const activeTab = ref('1')

const tabContent =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam soluta explicabo reprehenderit? Vero fugit officiis enim temporibus nihil, quibusdam ea?'
</script>
<style lang="scss">
@import '@oruga-ui/oruga/dist/oruga.min.css';

.o-tabs {
  @include ktheme() {
    box-shadow: theme('primary-shadow');
  }

  &__nav {
    overflow-x: initial;

    &-item {
      &-default {
        border-right: 0;
        padding: 8px;

        @include ktheme() {
          border: 1px solid theme('border-color');
          color: theme('text-color');

          &--active {
            background-color: theme('background-color-inverse');
            color: theme('text-color-inverse');
          }

          &:hover:not(.o-tabs__nav-item-default--active) {
            background-color: theme('k-accentlight2');
          }
        }
      }

      &-wrapper:last-child {
        button {
          @include ktheme() {
            border-right: 1px solid theme('border-color');
          }
        }
      }
    }
  }

  &__content {
    @include ktheme() {
      border: 1px solid theme('border-color');
    }

    &--fixed {
      min-height: 16rem;
      overflow-y: auto;
    }
  }
}
</style>
