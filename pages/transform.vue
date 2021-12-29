<template>
  <section>
    <p class="title is-size-3">
      {{ $t('Transform') }}
    </p>
    <BasicInput
      v-model="url"
      :label="$t('helper.urlToTransform.label')"
      :placeholder="$t('helper.urlToTransform.placeholder')"
      @keydown.native.space.prevent
    />
    <DisabledInput v-show="!disabled" label="KodaDot URL" :value="fullUrl" />
    <b-button
      type="is-primary"
      icon-left="copy"
      v-clipboard:copy="fullUrl"
      outlined
      @click="toast"
      :disabled="disabled"
    >
      {{ $t('general.copyUrl') }}
    </b-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import transform from '@/utils/urlTransformer'
import { exist } from '@/components/rmrk/Gallery/Search/exist'

@Component({
  components: {
    BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
    DisabledInput: () => import('@/components/shared/DisabledInput.vue'),
  },
})
export default class Transform extends Vue {
  protected url = ''

  /**
   * middleware({}) - to help perform actions while a route is resolved
   */

  middleware({ route, redirect }) {
    const baseTransformQueryUrl = 'https://singular.rmrk.app/collectibles/'

    if (
      route.query &&
      route.query.url?.toString().startsWith(baseTransformQueryUrl)
    ) {
      const urlToOpen = route.query.url.slice(baseTransformQueryUrl.length)
      redirect({
        path: `/rmrk/detail/${urlToOpen}`,
      })
    }
  }

  public mounted(): void {
    exist(this.$route.query.url, (value) => this.url = value)
  }

  layout() {
    return 'centered-half-layout'
  }

  get transformedUrl(): string {
    return transform(this.url)
  }

  get fullUrl(): string {
    return `${window.location.origin}${this.transformedUrl}`
  }

  get disabled(): boolean {
    return this.transformedUrl === ''
  }

  private toast(): void {
    const message = this.$t('helper.urlToTransform.copy').toString()
    this.$buefy.toast.open(message)
  }
}
</script>
