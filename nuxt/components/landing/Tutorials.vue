<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-12">
              <div class="mb-5">
                <h2 class="heading heading-is-4 text-bold uppercase mb-6">
                  <span class="text__stroked heading heading-is-6">
                    Tutorials
                  </span>
                </h2>
                <div
                  class="is-flex-inline is-align-items-start is-flex-direction-column"
                >
                  <!-- <router-link :to="{name: 'createAccount'}"> -->
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.youtube.com/watch?v=iG8iQrONnYo"
                  >
                    <b-button
                      type="is-primary"
                      class="mb-6"
                    >
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
                    <b-button
                      type="is-primary"
                      class="mb-6"
                    >
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
                    <b-button
                      type="is-primary"
                      class="mb-6"
                    >
                      {{ $t("tutorial.mint") }}
                    </b-button>
                  </a>
                  <!-- </router-link> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Tutorials extends Vue {}
</script>
