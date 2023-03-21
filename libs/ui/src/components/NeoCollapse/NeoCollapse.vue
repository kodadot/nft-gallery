<template>
  <o-collapse
    class="card"
    animation="slide"
    :open="false"
    content-class="collapse-content">
    <template #trigger="props">
      <div
        class="card-header"
        role="button"
        :class="{ 'active-collpase': props.open }">
        <p
          class="card-header-title is-flex is-justify-content-center is-align-items-center is-flex-grow-1">
          <slot name="title" />
        </p>
        <a
          class="card-header-icon is-flex is-justify-content-center is-align-items-center">
          <o-icon :icon="props.open ? 'chevron-up' : 'chevron-down'"> </o-icon>
        </a>
      </div>
    </template>
    <div class="card-content">
      <div class="content">
        <slot name="content" />
      </div>
    </div>
  </o-collapse>
</template>

<script lang="ts" setup>
import { OCollapse, OIcon } from '@oruga-ui/oruga'
</script>

<style lang="scss">
@import './NeoCollapse.scss';
</style>
