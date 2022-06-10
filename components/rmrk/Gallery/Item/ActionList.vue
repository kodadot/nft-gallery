<template>
  <div class="buttons">
    <b-button
      v-for="action in actions"
      :key="action"
      :type="iconType(action)"
      outlined
      expanded
      @click="handleActionSelect(action)">
      {{ action }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { getActionButtonColor, ShoppingActions } from '@/utils/shoppingActions'

@Component({})
export default class ActionList extends Vue {
  @Prop({ type: Array, required: false }) public actions!: ShoppingActions[]

  @Emit('click')
  protected handleActionSelect(action: ShoppingActions) {
    return action
  }

  protected iconType(value: ShoppingActions): string {
    return getActionButtonColor(value)
  }
}
</script>
