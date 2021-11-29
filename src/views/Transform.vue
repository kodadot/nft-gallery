<template>
  <div class="columns mb-6">
    <div class="column is-6 is-offset-3">
      <section>
        <br />
        <p class="title is-size-3">
            Transform
        </p>
        <BasicInput
          v-model="url"
          :label="$t('helper.urlToTransform.label')"
          :placeholder="$t('helper.urlToTransform.placeholder')"
          @keydown.native.space.prevent
        />
        <DisabledInput v-show="!disabled" label="KodaDot URL" :value="fullUrl" />
        <b-button
          type="is-success"
          icon-left="copy"
          v-clipboard:copy="transformedUrl"
          outlined
          :disabled="disabled"
        >
          {{ $t('general.copyUrl') }}
        </b-button>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import transform from '@/utils/urlTransformer'

@Component({
  components: {
    BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
    DisabledInput: () => import('@/components/shared/DisabledInput.vue'),
  },
})
export default class Transform extends Vue {
  protected url = ''

  get transformedUrl(): string {
    return transform(this.url)
  }

  get fullUrl(): string {
    return `${window.location.origin}${this.transformedUrl}`
  }

  get disabled(): boolean {
    return this.transformedUrl === ''
  }
}
</script>
