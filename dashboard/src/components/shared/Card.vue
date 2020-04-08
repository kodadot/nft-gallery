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
                <p class="card-header-title truncate">
                    {{nature}}
                </p>
                <a class="card-header-icon">
                    <b-icon
                        :icon="props.open ? 'caret-down' : 'caret-up'">
                    </b-icon>
                </a>
            </div>
            <div class="card-content">
                <div class="content truncate">
                    <a :href="blockExplorerPrefix + natureDesc">{{natureDesc}}</a>
                </div>
            </div>
            <footer class="card-footer">
                <a class="card-footer-item">
                  <div class="truncate-bottom-slot">
                    {{type}}
                  </div>
                </a>
                <a class="card-footer-item truncate">
                  <div class="truncate-bottom-slot">
                    {{extrinsicHash}}
                  </div>
                </a>
                <a class="card-footer-item truncate">
                  <div class="truncate-bottom-slot">
                  {{lifetime}}
                  </div>
                </a>
            </footer>
        </b-collapse>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import keyring from '@vue-polkadot/vue-keyring';


@Component
export default class Card extends Vue {
  @Prop({ default: false}) public open!: boolean;
  @Prop(String) public nature!: string;
  @Prop(String) public natureDesc!: string;
  @Prop(String) public type!: string;
  @Prop(String) public extrinsicHash!: string;
  @Prop(String) public lifetime!: string;

  private isPassValid: boolean = true;
  private blockExplorerPrefix: string = 'https://polkascan.io/pre/kusama/block/'

  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password);
  }
}
</script>
<style scoped>
.truncate {
  /* width: 100px; */
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
