<template>
  <div class="mb-5">
    <p class="sub-title is-6"><b>{{ $t(title) }}</b></p>
    <p class="mt-2">{{ $t(description) }}</p>
    <pre>
    <code v-once>
      {{ $t(fileName) }}
      <br />
      {{ $t('massMint.syntax.name') }}
      <br />
      {{ $t('massMint.syntax.amount') }}
      <br />
      {{ $t('massMint.syntax.description') }}
    </code>
    </pre>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class MassMintTutorial extends Vue {
  @Prop({ type: String, default: 'massMint.tutorial.basic.title' })
  protected title!: string;

  @Prop({ type: String, default: 'massMint.tutorial.basic.description' })
  protected description!: string;

  @Prop({ type: String, default: 'massMint.syntax.file' })
  protected fileName!: string;
}
</script>
