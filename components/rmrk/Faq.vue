<template>
  <div class="box container">
    <h2 class="heading text-bold uppercase mb-6">
      <span class="text__stroked heading heading-is-6">
        {{ $t('Frequently Asked Question') }}
      </span>
    </h2>
    <p class="faq__box heading heading-is-2 text-bold is-flex-inline mb-6">
      No time for reading? <br>
      No problem. Check out <br>
      <router-link :to="{ name: 'tutorials' }">
        Our tutorials.
      </router-link>
    </p>
    <div
      v-for="qa in faqQuestionsAnswers"
      :key="qa[0]"
      class="mb-5"
    >
      <b-collapse
        :id="qa[0].replace(/ /g, '-')"
        :open="false"
      >
        <template #trigger="props">
          <div class="is-flex title">
            <a
              class="card-header-icon has-text-primary"
              :href="'#' + qa[0].replace(/ /g, '-')"
            >
              <b-icon :icon="!props.open ? 'chevron-down' : 'chevron-up'" />
            </a>
            <h3 class="heading heading-is-2 max-w-600 has-text-weight-semibold">
              {{ qa[0] }}
            </h3>
          </div>
        </template>
        <div class="content">
          <p class="subtitle">
            <span v-html="qa[1]" />
          </p>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import i18n from '@/i18n'

@Component({})
export default class Faq extends Vue {
  public faqQuestionsAnswers: any = [];

  @Watch('$i18n.locale')
  public i18nLoadQandA(): any {
    let i: number
    const qa: any = []
    for (i = 1; i < 24; i++) {
      qa.push([i18n.t(`faq.q.${i}`), i18n.t(`faq.a.${i}.m`)])
    }

    this.faqQuestionsAnswers = qa
  }

  public async mounted() {
    if (this.faqQuestionsAnswers) {
      this.i18nLoadQandA()
    }

    this.$nextTick(() => {
      // smooth scroll to #
      if (this.$route.hash) {
        const el = document.getElementById(this.$route.hash.slice(0, 1))
        const headerOffset = 110
        const elementPosition = el?.getBoundingClientRect().top
        const offsetPosition = elementPosition
          ? elementPosition - headerOffset
          : elementPosition
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    })
  }
}
</script>

<style scoped>
/* CSS hack to scroll under navbar */
.collapse {
  padding-top: 110px;
  margin-top: -110px;
}
</style>
