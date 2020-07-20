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
            <div v-for="e in event" :key="e.index">
              <b-message :closable="false" class="has-identicon" >
                <div v-for="(line) in e" :key="line.index">
                  <div class="column is-2"
                    v-if="validateAddress(line)"
                    v-clipboard:copy="open"
                    @click="toast('Address copied to clipboard')"> 
                    <div class="columns">
                      <div class="column">
                      <Identicon
                        :value="line"
                        :theme="theme"
                        :size="size" />
                      </div>
                      <div class="column">
                        {{line}}
                      </div>
                    </div>
                  </div>
                  <div v-if="!validateAddress(line)" class="column">
                    {{line}}
                  </div>
                </div>
              </b-message>
            </div>
          </div>
        </div>    
      </b-collapse>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identicon from '@polkadot/vue-identicon';
import keyring from '@polkadot/ui-keyring';
import { u8aToString } from '@polkadot/util';

@Component({
  components: {
    Identicon,
  }
})
export default class CardRecentEvent extends Vue {
  @Prop({ default: 48 }) public size!: number;
  @Prop({ default: 'polkadot'}) public theme!: string;
  @Prop({ default: false}) public open!: boolean;
  @Prop() public header!: any;
  @Prop() public content!: any;
  @Prop() public event!: any;

  public toast(message: string): void {
    this.$buefy.toast.open(message);
  }

  private validateAddress(address: string): boolean {
    try {
      const keyringmagic = keyring.encodeAddress(keyring.decodeAddress(address));
      console.log('CardRecentEvent -> validateAddress -> keyringmagic', keyringmagic);
      return true;
    } catch (error) {
      return false;
    }
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

.has-identicon {

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
