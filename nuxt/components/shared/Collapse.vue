<template>
  <div>
    <b-collapse
      aria-id="contentIdForA11y2"
      class="panel"
      animation="slide"
      :open.sync="isOpen"
    >
      <div
        slot="trigger"
        class="panel-heading"
        role="button"
        aria-controls="contentIdForA11y2"
      >
        <strong>{{ title }}</strong>
      </div>
      <div
        v-for="(n, index) in content"
        :key="index"
        class="panel-block"
      >
        <DisabledInput
          :label="n[0]"
          :value="n[1]"
        />
      </div>
    </b-collapse>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import DisabledInput from '@/components/shared/DisabledInput.vue'

@Component({
  components: {
    DisabledInput,
  }
})
export default class Collapse extends Vue {
  private isOpen = false
  @Prop({default: false}) private open!: boolean;
  @Prop({default: 'title'}) private title!: string;
  @Prop() private content: any;

  public async mounted() {
    this.isOpen = this.open
  }
}
</script>
