<template>
  <section>
    <div class="content">
      <p class="title is-4">
        Before you visit a dark forrest.
      </p>
      <p>
          Mass mint is a feature that allows you to mint multiple tokens at
          once.
          <br />
          It is recommended to use this feature with caution.
      </p>
    </div>
    <b-collapse :open="false" position="is-bottom" aria-id="contentIdForA11y1">
      <template #trigger="props">
        <a aria-controls="contentIdForA11y1">
          <b-icon :icon="!props.open ? 'chevron-down' : 'chevron-up'"></b-icon>
          {{ !props.open ? "Show syntax" : "OK, I get it" }}
        </a>
      </template>
      <Syntax />
      <Syntax
        title="massMint.tutorial.range.title"
        description="massMint.tutorial.range.description"
        fileName="massMint.syntax.range"
      />
      <Syntax
        title="massMint.tutorial.all.title"
        description="massMint.tutorial.all.description"
        fileName="massMint.syntax.all"
      />
    </b-collapse>
  </section>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
    Syntax: () => import('./MassMintSyntax.vue'),
  }
})
export default class MassMintTutorial extends Vue {}
</script>
