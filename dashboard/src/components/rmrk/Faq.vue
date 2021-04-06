<template>
  <div>
    <div class="box">
      <p class="title">
        {{ $t('Frequently Asked Question') }}
      </p>
      <div v-for="qa in faqQuestionsAnswers"
        v-bind:key="qa[0]">
        <p class="title">
          {{qa[0]}}
        </p>
        <p class="subtitle">
          <span v-html="qa[1]"></span>
        </p>
        <br>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import i18n from '@/i18n';

function i18nLoadQandA(): Array<any> {
  let i: number;
  let qa: Array<any> = [];
  for (i = 1; i < 24; i++) {
    qa.push([
      i18n.t(`faq.q.${i}`),
      i18n.t(`faq.a.${i}.m`),
    ]);
  }

  return qa;
}

@Component({})
export default class Faq extends Vue {
  public faqQuestionsAnswers: any = i18nLoadQandA();
}
</script>
