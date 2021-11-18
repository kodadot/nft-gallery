<template>
  <div>
    <div class="container">
      <h1 class="text-bold text__stroked heading heading-is-6 is-size-1-mobile mb-6">
        Tutorials
      </h1>
      <div
        class="is-flex-inline is-align-items-start is-flex-direction-column"
      >
        <!-- <router-link :to="{name: 'createAccount'}"> -->
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.youtube.com/watch?v=iG8iQrONnYo"
        >
          <b-button type="is-primary" class="mb-6">
            {{ $t("tutorial.create") }}
          </b-button>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{name: 'createAccount'}"> -->
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.youtube.com/watch?v=cYaZWDzU1Yc"
        >
          <b-button type="is-primary" class="mb-6">
            {{ $t("tutorial.ksm") }}
          </b-button>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{name: 'createAccount'}"> -->
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.youtube.com/watch?v=pPsbQyJRGVQ"
        >
          <b-button type="is-primary" class="mb-6">
            {{ $t("tutorial.mint") }}
          </b-button>
        </a>
        <!-- </router-link> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Tutorials extends Vue {}
</script>
