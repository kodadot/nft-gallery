<template>
  <div :class="{ 'vector-argument-wrapper': !disabled }">
    <strong v-if="!disabled"> {{ argument.name }}: {{ argument.type }} </strong>
    <ArgumentHandler
      v-for="(arg, index) in fields"
      :key="index"
      :argument="enhanceTypeDef(arg, index)"
      :disabled="disabled"
      :default-value="getDefaultValue(index)"
      @selected="selected"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { createType, getTypeDef } from '@polkadot/types'
import findComponent from '@/params/components/findComponent'
import registry from '@/params/components/typeRegistry'

@Component({
  name: 'Struct',
  components: {
    ArgumentHandler: () => import('@/components/extrinsics/ArgumentHandler.vue')
  },
})
export default class Struct extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  get fields(): any[] {
    return this.argument && this.argument.sub || []
  }

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value })

    this.$emit('selected', { [this.argument.name.toString()]: value })
  }

  get arg() {
    return ''
  }

  public getDefaultName(index: number) {
    return Object.keys(this.defaultValue || {})[index] || index
  }

  public getDefaultValue(index: number) {
    return Object.values(this.defaultValue || {})[index] || index
  }

  public enhanceTypeDef(argument: any, index: number) {
    console.log(this.defaultValue)
    return { ...getTypeDef(createType(registry, argument.type).toRawType()), ...argument, name: this.getDefaultName(index) }
  }

  public selected(argument: any) {
    const component = findComponent(argument)
    return component
  }
}
</script>

<style scoped>
.vector-argument-wrapper {
  margin-left: 1em;
}

@media only screen and (max-width: 425px) {
  .vector-argument-wrapper {
    margin-left: 0;
  }
}
</style>
