<template>
  <div id="Card">
    <section>
        <b-collapse class="card" aria-id="contentIdForA11y3">
            <div
                slot="trigger" 
                slot-scope="props"
                class="card-header"
                role="button"
                aria-controls="contentIdForA11y3">
                <p class="card-header-title">
                    {{nature}}
                </p>
                <a class="card-header-icon">
                    <b-icon
                        :icon="props.open ? 'caret-down' : 'caret-up'">
                    </b-icon>
                </a>
            </div>
            <div class="card-content">
                <div class="content">
                    {{natureDesc}}
                </div>
            </div>
            <footer class="card-footer">
                <a class="card-footer-item">{{type}}</a>
                <a class="card-footer-item">{{extrinsicHash}}</a>
                <a class="card-footer-item">{{lifetime}}</a>
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
  @Prop(String) public nature: string = '';
  @Prop(String) public natureDesc: string = '';
  @Prop(String) public type: string = '';
  @Prop(String) public extrinsicHash: string = '';
  @Prop(String) public lifetime: string = '';

  private isPassValid: boolean = true;

  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password);
  }
}
</script>
