<template>
  <section>
    <h1
      class="has-text-weight-bold text__stroked heading heading-is-6 is-size-1-mobile mb-8">
      Tutorials
    </h1>
    <div class="is-flex is-flex-direction-column">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.youtube.com/watch?v=iG8iQrONnYo">
        <b-button type="is-primary" class="mb-8">
          {{ $t('tutorial.create') }}
        </b-button>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.youtube.com/watch?v=cYaZWDzU1Yc">
        <b-button type="is-primary" class="mb-8">
          {{ $t('tutorial.ksm') }}
        </b-button>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.youtube.com/watch?v=pPsbQyJRGVQ">
        <b-button type="is-primary" class="mb-8">
          {{ $t('tutorial.mint') }}
        </b-button>
      </a>
    </div>
  </section>
</template>
