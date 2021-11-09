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
        <footer class="card-footer card-footer__extrincis">
          <div class="card-footer-item">
            <div class="truncate-bottom-slot">
              <i>{{ item1header }}</i><br>
              {{ item1 }}
            </div>
          </div>
          <div class="card-footer-item">
            <div class="truncate-bottom-slot">
              <i>{{ item2header }}</i><br>
              {{ item2 }}
            </div>
          </div>
          <div class="card-footer-item">
            <div class="truncate-bottom-slot">
              <i>{{ item3header }}</i><br>
              {{ item3 }}
            </div>
          </div>
        </footer>
      </b-collapse>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class CardExtrinsic extends Vue {
  @Prop({ default: false}) public open!: boolean;
  @Prop() public header!: any;
  @Prop() public content!: any;
  @Prop() public item1!: any;
  @Prop() public item1header!: any;
  @Prop() public item2!: any;
  @Prop() public item2header!: any;
  @Prop() public item3!: any;
  @Prop() public item3header!: any;
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

@media only screen and (max-width: 768px) {
  .card-footer__extrincis {
    flex-direction: column;
  }

  .truncate-bottom-slot {
    width: auto;
  }
}

</style>
