<template>
  <Story :layout="{ type: 'single' }">
    <Variant>
      <div :style="{ padding: '5rem' }" />
      <o-tabs
        v-model="activeTab"
        expanded
        content-class="o-tabs__content--fixed">
        <TooltipTab
          disabled
          value="0"
          label="Disabled"
          disabled-tooltip="Not Available" />
        <TooltipTab value="1" label="Enabled">
          <div>
            {{ tabContent }}
          </div>
        </TooltipTab>
      </o-tabs>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import TooltipTab from './TooltipTab.vue'
import { OTabs } from '@oruga-ui/oruga'
import { ref } from 'vue'

const activeTab = ref('1')

const tabContent =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam soluta explicabo reprehenderit? Vero fugit officiis enim temporibus nihil, quibusdam ea?'
</script>
<style lang="scss">
@import '@oruga-ui/oruga/dist/oruga.min.css';
@import '@oruga-ui/oruga/dist/oruga-full-vars.min.css';

.o-tabs {
  box-shadow: 4px 4px 0px #000;

  &__nav {
    overflow-x: initial;

    &-item {
      &-default {
        border: 1px solid black;
        border-right: 0;
        color: black;
        padding: 8px;

        &--active {
          background-color: black;
          color: white;
        }

        &:hover:not(.o-tabs__nav-item-default--active) {
          background-color: #fff0f8;
        }
      }

      &-wrapper:last-child {
        button {
          border-right: 1px solid black;
        }
      }
    }
  }

  &__content {
    border: 1px solid black;

    &--fixed {
      min-height: 16rem;
      overflow-y: auto;
    }
  }
}

.dark-mode {
  .o-tabs {
    box-shadow: 4px 4px 0px white;

    &__nav {
      &-item {
        &-default {
          border: 1px solid white;
          color: white;

          &--active {
            background-color: white;
            color: black;
          }

          &:hover:not(.o-tabs__nav-item-default--active) {
            background-color: #363234;
          }
        }

        &-wrapper:last-child {
          button {
            border-right: 1px solid white;
          }
        }
      }
    }

    &__content {
      border: 1px solid white;
    }
  }
}
</style>
