<template>
  <div>
    <section>
      <b-collapse
        class="card"
        aria-id="contentIdForA11y3"
        :open="open"
      >
        <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3"
        >
          <p class="card-header-title">
            {{ header }}
          </p>
          <a class="card-header-icon">
            <b-icon
              :icon="props.open ? 'caret-down' : 'caret-up'"
            />
          </a>
        </div>
        <div class="card-content">
          <div class="content truncate">
            {{ content }}
          </div>
        </div>
      </b-collapse>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { urlBuilderBlockNumber } from '@/utils/explorerGuide'

@Component
export default class CardEvents extends Vue {
  @Prop({ default: false}) public open!: boolean;
  @Prop() public header!: any;
  @Prop() public content!: any;

}
</script>
<style scoped>
.truncate {
  max-width: 600px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate-bottom-slot {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
