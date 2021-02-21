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
import i18n from '@/i18n.ts';

@Component({})
export default class Faq extends Vue {
  public faqQuestionsAnswers: any = [
    [i18n.t('faq.q.1'), i18n.t('faq.a.1.m')],
    [i18n.t('faq.q.2'), i18n.t('faq.a.2.m')],
    [i18n.t('FAQQ3'), i18n.t('FAQA3')],
    [i18n.t('FAQQ4'), i18n.t('FAQA4')],
    [i18n.t('FAQQ5'), i18n.t('FAQA5')],
    [i18n.t('FAQQ6'), i18n.t('FAQA6')],
    [i18n.t('FAQQ7'), i18n.t('FAQA7')],
    [i18n.t('FAQQ8'), i18n.t('FAQA8')],
    [i18n.t('FAQQ9'), i18n.t('FAQA9')],
    [i18n.t('FAQQ10'), i18n.t('FAQA10')],
    [i18n.t('FAQQ11'), i18n.t('FAQA11')],
    [i18n.t('FAQQ12'), i18n.t('FAQA12')],
    [i18n.t('FAQQ13'), i18n.t('FAQA13')],
    [i18n.t('FAQQ14'), i18n.t('FAQA14')],
    [i18n.t('FAQQ15'), i18n.t('FAQA15')],
    [i18n.t('FAQQ16'), i18n.t('FAQA16')],
    [i18n.t('FAQQ17'), i18n.t('FAQA17')],
    [i18n.t('FAQQ18'), i18n.t('FAQA18')],
    [i18n.t('FAQQ19'), i18n.t('FAQA19')],
    [i18n.t('FAQQ20'), i18n.t('FAQA20')],
    [i18n.t('FAQQ21'), i18n.t('FAQA21')],
    [i18n.t('FAQQ22'), i18n.t('FAQA22')],
    [i18n.t('FAQQ23'), i18n.t('FAQA23')],
  ];
}
</script>
