<template>
  <div class="columns mb-6">
    <div class="column is-6 is-offset-3">
      <section>
        <br />
        <BasicInput
          v-model="url"
          :label="$t('mint.collection.symbol.label')"
          :message="$t('mint.collection.symbol.message')"
          :placeholder="$t('mint.collection.symbol.placeholder')"
          @keydown.native.space.prevent
        />
        <DisabledInput label="hex input data" value="isHexAddress" />
        <b-button
          type="is-primary"
          icon-left="paper-plane"
          outlined
        >
          {{ $t('general.open') }}
        </b-button>
        <b-button
          type="is-primary"
          icon-left="paper-plane"
          outlined
        >
          {{ $t('general.copy') }}
        </b-button>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
    DisabledInput: () => import('@/components/shared/DisabledInput.vue'),
  },
})
export default class Transfer extends Vue {
  protected url = ''

  get transformedUrl() {
    return this.url
  }
}
</script>
