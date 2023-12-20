<template>
  <Story title="NeoCollapsible">
    <Variant>
      <NeoCollapsible>
        <div>Text</div>
        <template #content>
          <div>Content</div>
        </template>
      </NeoCollapsible>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoCollapsible from './NeoCollapsible.vue'
</script>
