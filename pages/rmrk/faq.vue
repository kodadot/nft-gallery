<template>
  <div class="container">
    <h1
      class="text-bold text__stroked heading heading-is-6 is-size-1-mobile mb-6">
      {{ $t('Frequently Asked Question') }}
    </h1>

    <p
      class="faq__box heading is-size-4-mobile is-size-3-tablet text-bold is-flex-inline mb-6">
      No time for reading? <br />
      No problem. Check out <br />
      <nuxt-link :to="{ name: 'tutorials' }"> Our tutorials. </nuxt-link>
    </p>

    <div v-for="qa in faqQuestionsAnswers" v-bind:key="qa[0]" class="mb-5">
      <b-collapse :open="false" :id="qa[0].replace(/ /g, '-')">
        <template #trigger="props">
          <div class="is-flex is-align-items-center">
            <a class="has-text-primary" :href="'#' + qa[0].replace(/ /g, '-')">
              <b-icon
                :icon="!props.open ? 'chevron-down' : 'chevron-up'"
                class="mr-4">
              </b-icon>
            </a>
            <h3
              class="heading is-size-5-mobile is-size-4-tablet max-w-600 has-text-weight-semibold">
              {{ qa[0] }}
            </h3>
          </div>
        </template>
        <div class="content">
          <p v-html="qa[1]"></p>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import i18n from '@/utils/config/i18n'

@Component({})
export default class Faq extends Vue {
  public faqQuestionsAnswers: any = []

  @Watch('$i18n.locale', { immediate: true, deep: true })
  public i18nLoadQandA(): any {
    i18n.locale = this.$i18n.locale
    let i: number
    const qa: any = []
    for (i = 1; i < 28; i++) {
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
          behavior: 'smooth',
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
