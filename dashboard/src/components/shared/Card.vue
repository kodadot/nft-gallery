<template>
  <div id="Card">
    <section>
      <b-collapse class="card" aria-id="contentIdForA11y3" :open="open">
        <div
          slot="trigger" 
          slot-scope="props"
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3">
          <p class="card-header-title"> 
              <a :href="getExplorerUrl(nature)">🧊 {{nature}}</a>
          </p>
          <a class="card-header-icon">
            <b-icon
                :icon="props.open ? 'caret-down' : 'caret-up'">
            </b-icon>
          </a>
        </div>
        <div class="card-content">
            <div class="content truncate">
                <a :href="getExplorerUrl(natureDesc)">{{natureDesc}}</a>
            </div>
        </div>
        <footer class="card-footer">
          <router-link :to="{ name: 'explorerByTabHash', 
            params: { tab: 1, hash: type }}" class="card-footer-item">
            <div class="truncate-bottom-slot">
              <i>parent</i><br>
              {{type}}
            </div>
          </router-link>
          <div class="card-footer-item truncate">
            <div class="truncate-bottom-slot">
              <i>extrinsics</i><br>
              {{extrinsicHash}}
            </div>
          </div>
          <div class="card-footer-item truncate">
            <div class="truncate-bottom-slot">
            <i>state</i><br>
            {{lifetime}}
            </div>
          </div>
        </footer>
      </b-collapse>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import urlBuilder from '@/utils/explorerGuide';

@Component
export default class Card extends Vue {
  @Prop({ default: false}) public open!: boolean;
  @Prop(String) public nature!: string;
  @Prop(String) public natureDesc!: string;
  @Prop(String) public type!: string;
  @Prop(String) public extrinsicHash!: string;
  @Prop(String) public lifetime!: string;
  
  getExplorerUrl(value: string) {
    return urlBuilder(value, 
      this.$store.state.explorer.chain, 
      this.$store.state.explorer.provider)
  } 
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
