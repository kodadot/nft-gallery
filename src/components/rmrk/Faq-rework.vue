<template>
  <div class="box container">
    <h2 class="heading text-bold uppercase mb-6">
      <span class="text__stroked heading heading-is-6">
        {{ $t('Frequently Asked Question') }}
      </span>
    </h2>
    <p class="faq__box heading heading-is-2 text-bold is-flex-inline mb-6">
      No time for reading? <br />
      No problem. Check out <br />
      <router-link :to="{ name: 'tutorials' }">
        Our tutorials.
      </router-link>
    </p>
    <div v-for="qa in faqQuestionsAnswers" v-bind:key="qa[0]" class="mb-5">
      <b-collapse :open="true" :id="qa[0]">
        <template #trigger="props">
          <div class="is-flex title">
            <a class="card-header-icon has-text-primary">
              <b-icon :icon="!props.open ? 'chevron-down' : 'chevron-up'"> </b-icon>
            </a>
            <h3 class="heading heading-is-2 max-w-600 has-text-weight-semibold">
              {{ qa[0] }}
            </h3>
          </div>
        </template>
        <div class="content">
          <p class="subtitle">
            <span v-html="qa[1]"></span>
          </p>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import i18n from '@/i18n';

@Component({})
export default class Faq extends Vue {
  public faqQuestionsAnswers: any = [];

  @Watch('$i18n.locale')
  public i18nLoadQandA(): any {
    let i: number;
    const qa: any = [];
    for (i = 1; i < 24; i++) {
      qa.push([i18n.t(`faq.q.${i}`), i18n.t(`faq.a.${i}.m`)]);
    }

    this.faqQuestionsAnswers = qa;
  }

  public async mounted() {
    if (this.faqQuestionsAnswers) {
      this.i18nLoadQandA();
    }
  }
}
</script>
