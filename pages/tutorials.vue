<template>
  <section>
    <h1
      class="text-bold text__stroked heading heading-is-6 is-size-1-mobile mb-6"
    >
      Tutorials
    </h1>
    <div class="is-flex-inline is-align-items-start is-flex-direction-column">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.youtube.com/watch?v=iG8iQrONnYo"
      >
        <b-button type="is-primary" class="mb-6">
          {{ $t('tutorial.create') }}
        </b-button>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.youtube.com/watch?v=cYaZWDzU1Yc"
      >
        <b-button type="is-primary" class="mb-6">
          {{ $t('tutorial.ksm') }}
        </b-button>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.youtube.com/watch?v=pPsbQyJRGVQ"
      >
        <b-button type="is-primary" class="mb-6">
          {{ $t('tutorial.mint') }}
        </b-button>
      </a>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Tutorials extends Vue {}
</script>
