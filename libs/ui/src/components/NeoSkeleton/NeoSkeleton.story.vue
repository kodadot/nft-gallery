<template>
  <Story title="NeoSkeleton">
    <Variant title="20% width">
      <NeoSkeleton width="20%"></NeoSkeleton>
    </Variant>

    <Variant title="20px width">
      <NeoSkeleton :width="20"></NeoSkeleton>
    </Variant>

    <Variant title="circle skeleton">
      <NeoSkeleton width="64px" height="64px" circle></NeoSkeleton>
    </Variant>

    <Variant title="2 skeleton">
      <NeoSkeleton :count="2"></NeoSkeleton>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoSkeleton from './NeoSkeleton.vue'
</script>
