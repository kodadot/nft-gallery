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
                <div class="is-flex-inline is-align-items-start is-flex-direction-column">
                  <router-link :to="{name: 'createAccount'}">
                    <b-button
                      type="is-primary"
                      class="mb-6"
                    >
                      1. Create polkadot js account
                    </b-button>
                  </router-link>
                  <router-link :to="{name: 'createAccount'}">
                    <b-button
                      type="is-primary"
                      class="mb-6"
                    >
                      2. Get KSM
                    </b-button>
                  </router-link>
                  <router-link :to="{name: 'createAccount'}">
                    <b-button
                      type="is-primary"
                      class="mb-6"
                    >
                      3. Minting
                    </b-button>
                  </router-link>
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
import { Component, Vue } from 'vue-property-decorator';


@Component<Tutorials>({
  components: {}
})
export default class Tutorials extends Vue {

}
</script>
