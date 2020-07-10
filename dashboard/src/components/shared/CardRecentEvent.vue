<template>
  <div>
    <section>
      <b-collapse class="card" aria-id="contentIdForA11y3" :open="open">
        <div
          slot="trigger" 
          slot-scope="props"
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3">
          <p class="card-header-title"> 
            {{header}}
          </p>
          <a class="card-header-icon">
            <b-icon
              :icon="props.open ? 'caret-down' : 'caret-up'">
            </b-icon>
          </a>
        </div>
        <div class="card-content">
          <div class="content truncate">
            {{content}}
            <b-message type="is-info" has-icon v-for="e in event" :key="e.index">
              <span v-for="line in e" :key="line.index">
                {{line}}<br>
              </span>
            </b-message>
          </div>
        </div>    
      </b-collapse>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CardRecentEvent extends Vue {
  @Prop({ default: false}) public open!: boolean;
  @Prop() public header!: any;
  @Prop() public content!: any;
  @Prop() public event!: any;
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
