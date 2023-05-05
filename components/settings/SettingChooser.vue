<template>
  <div class="setting-chooser-wrapper">
    <NeoField :label="label">
      <b-select v-model="selected" :placeholder="label" expanded>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value">
          {{ option.text }}
        </option>
      </b-select>
    </NeoField>
    <AddOption v-if="hasAdd" :label="label" @add="handleAddedOption" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import AddOption from './AddOption.vue'
import { NeoField } from '@kodadot1/brick'

@Component({
  components: {
    AddOption,
    NeoField,
  },
})
export default class SettingChooser extends Vue {
  @Prop() public label!: string
  @Prop() public selector!: string
  @Prop() public setter!: string
  @Prop() public defaultValue!: string
  @Prop() public addOption!: string
  @Prop() public addMethod!: string

  get options() {
    return this.$store.getters[this.selector]
  }

  get selected() {
    return this.$store.getters.getSettings[this.defaultValue]
  }

  set selected(value) {
    this.$store.dispatch(this.setter, value)
  }

  get hasAdd() {
    return this.addOption
  }

  public handleAddedOption(nodeOption: any) {
    this.$store.dispatch(this.addMethod, nodeOption)
  }
}
</script>
<style scoped>
.setting-chooser-wrapper {
  margin-top: 1em;
}
</style>
