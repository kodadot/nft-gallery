<template>
  <Story>
    <Variant>
      <o-tabs expanded content-class="o-tabs__content--fixed">
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
//   const activeTab = ref('1');
import { OTabs } from '@oruga-ui/oruga'

const tabContent =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam soluta explicabo reprehenderit? Vero fugit officiis enim temporibus nihil, quibusdam ea?'
</script>
