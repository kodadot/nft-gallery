<template>
  <div>
    <b-collapse
      :open="false"
      aria-id="contentIdForA11y1"
    >
      <button
        slot="trigger"
        class="button is-primary"
        aria-controls="contentIdForA11y1"
      >
        Click me!
      </button>
      <slot />
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class CollapseWrapper extends Vue {
}

</script>
