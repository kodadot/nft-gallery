<template>
  <div class="setting-chooser-wrapper">
    <b-field :label="label">
      <b-select :placeholder="label" v-model="selected" expanded>
        <option
          v-for="option in options"
          :value="option.value"
          :key="option.value"
        >{{ option.text }}</option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class SettingChooserDevelopment extends Vue {
  @Prop() public label!: string;
  @Prop() public selector!: string;
  @Prop() public setter!: string;

  get options() {
    return this.$store.state.development[this.selector]
  }

  get selected() {
    return this.$store.state.development[this.selector].value
  }

  set selected(value) {
    this.$store.commit(this.setter, { status: value })
  }

  public async mounted() {
    this.$store.commit('setDevelopment',
      { status: this.$store.state.development.status || false,
        options: [
          { text: 'Hide Dev Accounts & Refresh', value: false },
          { text: 'Show Dev Accounts & Refresh', value: true },
        ]
      }
    )
  }
}
</script>
<style scoped>
.setting-chooser-wrapper {
  margin-top: 1em;
}
</style>
