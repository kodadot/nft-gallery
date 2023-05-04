<template>
  <div>
    <h1
      class="has-text-weight-bold text__stroked heading heading-is-6 is-size-1-mobile mb-8">
      {{ $t('faq.title') }}
    </h1>

    <p
      class="faq__box heading is-size-4-mobile is-size-3-tablet has-text-weight-bold mb-8">
      {{ $t('faq.box_heading1') }} <br />
      {{ $t('faq.box_heading2') }} <br />
      <nuxt-link :to="{ name: 'tutorials' }">
        {{ $t('faq.box_heading_link') }}
      </nuxt-link>
    </p>

    <div v-for="qa in faqQuestionsAnswers" :key="qa[0]" class="mb-5">
      <b-collapse :id="qa[0].replace(/ /g, '-')" :open="false">
        <template #trigger="props">
          <div class="is-flex is-align-items-center">
            <a class="has-text-primary" :href="'#' + qa[0].replace(/ /g, '-')">
              <NeoIcon
                :icon="!props.open ? 'chevron-down' : 'chevron-up'"
                class="mr-4" />
            </a>
            <h3
              class="heading is-size-5-mobile is-size-4-tablet has-text-weight-semibold">
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
import { NeoIcon } from '@kodadot1/brick'

@Component({
  components: {
    NeoIcon,
  },
})
export default class FrequentlyAsked extends Vue {
  public faqQuestionsAnswers: any = []

  @Watch('$i18n.locale', { immediate: true, deep: true })
  public i18nLoadQandA(): any {
    let i: number
    const qa: any = []
    for (i = 1; i <= 37; i++) {
      qa.push([this.$t(`faq.q.${i}`), this.$t(`faq.a.${i}.m`)])
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
