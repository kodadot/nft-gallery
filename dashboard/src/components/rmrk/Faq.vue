<template>
  <div class="box container">
    <p class="title">
      {{ $t('Frequently Asked Question') }}
    </p>
    <div
      v-for="n in 23"
      :key="n">
      <p class="title">
        <span v-html="$t(`FAQQ${n}`)"></span>
      </p>
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
