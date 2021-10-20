<template>
<div>
  <b-collapse :open="false" aria-id="contentIdForA11y1">
    <button
      class="button is-primary"
      slot="trigger"
      aria-controls="contentIdForA11y1"
    >
      Click me!
    </button>
    <slot></slot>
  </b-collapse>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CollapseWrapper extends Vue {
}

</script>
