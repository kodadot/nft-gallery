<template>
  <section>
    <p class="title is-size-3">
      {{ $t('transform') }}
    </p>
    <BasicInput
      v-model="url"
      :label="$t('helper.urlToTransform.label')"
      :placeholder="$t('helper.urlToTransform.placeholder')"
      @keydown.native.space.prevent />
    <DisabledInput v-show="!disabled" label="KodaDot URL" :value="fullUrl" />
    <b-button
      v-clipboard:copy="fullUrl"
      type="is-primary"
      icon-left="copy"
      outlined
      :disabled="disabled"
      @click="toast">
      {{ $t('general.copyUrl') }}
    </b-button>
    <b-button
      type="is-primary"
      icon-left="external-link-alt"
      outlined
      :disabled="disabled"
      @click="openUrl">
      {{ $t('general.openUrl') }}
    </b-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import transform from '@/utils/urlTransformer'
import { exist } from '@/utils/exist'

@Component({
  components: {
    BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
    DisabledInput: () => import('@/components/shared/DisabledInput.vue'),
  },
})
export default class Transform extends Vue {
  protected url = ''

  middleware({ route, redirect }) {
    const { url } = route.query

    if (url) {
      redirect({
        path: transform(url),
      })
    }
  }

  public mounted(): void {
    exist(this.$route.query.url, (value) => (this.url = value))
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

  private openUrl(): void {
    const url = transform(this.url.toString())

    this.$router.push({
      path: url,
    })
  }
}
</script>
