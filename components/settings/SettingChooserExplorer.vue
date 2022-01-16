<template>
  <div class="setting-chooser-wrapper">
    <b-field :label="label">
      <b-select v-model="selected" :placeholder="label" expanded>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({})
export default class SettingChooserExplorer extends Vue {
  @Prop() public label!: string;
  @Prop() public selector!: string;
  @Prop() public setter!: string;
  @Prop() public defaultValue!: string;
  @Prop() public addOption!: string;
  @Prop() public addMethod!: string;

  get options() {
    return this.$store.state['explorer/explorerOptions'].availableOptions[
      this.selector
    ];
  }

  get selected() {
    return this.$store.state['explorer/explorerOptions'].availableOptions[
      this.selector
    ][this.defaultValue].value;
  }

  set selected(value) {
    this.$store.commit(this.setter, { [this.selector]: value });
  }

  public async mounted() {
    this.$store.dispatch('explorer/setExplorerOptions', {
      availableOptions: {
        provider: [
          { text: 'Subscan', value: 'subscan' },
          { text: 'Polkascan', value: 'polkascan' },
        ],
        chain: [
          { text: 'Kusama', value: 'kusama' },
          { text: 'Edgeware', value: 'edgeware' },
          { text: 'Darwinia', value: 'crab' },
        ],
      },
    });
  }
}
</script>
<style scoped>
.setting-chooser-wrapper {
  margin-top: 1em;
}
</style>
