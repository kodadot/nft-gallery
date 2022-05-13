<template>
  <div>
    <b-button
      v-for="action in actions"
      :key="action"
      :type="iconType(action)"
      outlined
      expanded
      @click="handleActionSelect">
      {{ action }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

type DescriptionTuple = [string, string] | [string]
const iconResolver: Record<string, DescriptionTuple> = {
  SEND: ['is-info is-dark'],
  CONSUME: ['is-danger'],
  DELEGATE: ['is-light'],
  FREEZE: ['is-warning is-dark'],
  REVOKE: ['is-warning is-dark'],
}

@Component({})
export default class ActionList extends Vue {
  @Prop({ type: Array, required: false }) public actions!: string[]

  @Emit('click')
  protected handleActionSelect(action: string) {
    return action
  }

  protected iconType(value: string): string {
    return iconResolver[value][0]
  }
}
</script>
