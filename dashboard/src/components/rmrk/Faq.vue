<template>
  <div class="box container">
    <h2 class="heading text-bold uppercase mb-6">
      <span class="text__stroked heading heading-is-6">
        FAQ
      </span>
    </h2>
    <p class="faq__box heading heading-is-2 text-bold is-flex-inline mb-6">
      No time for reading? <br>
      No problem. Check out <br>
      <router-link :to="{name: 'tutorials'}">
        Our tutorials.
      </router-link>
    </p>
    <div
      v-for="n in 23"
      :key="n">
      <h3 class="title heading heading-is-2 max-w-600">
        <span v-html="$t(`FAQQ${n}`)"></span>
      </h3>
      <p class="subtitle">
        <span v-html="$t(`FAQA${n}`)"></span>
      </p>
      <br>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Faq extends Vue {}
</script>


<style lang="scss">
  @import '@/styles/variables';
  .faq {
    &__box {
      padding: 16px 32px;
      border: 2px solid $primary;
    }
  }
</style>
