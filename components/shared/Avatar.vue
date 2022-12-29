<template>
  <Identicon :size="size" :theme="'polkadot'" :value="value" class="avatar" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Identicon from '@polkadot/vue-identicon'

@Component({
  components: {
    Identicon,
  },
})
export default class Avatar extends Vue {
  @Prop({ default: '' }) public value!: string
  @Prop({ default: 64 }) public size!: number
}
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.avatar {
  box-shadow: $primary-shadow;
  border: 1px solid $black;
  border-radius: 50%;
  & > div {
    display: flex;
    align-items: center;
  }
}

.dark-mode {
  .avatar {
    box-shadow: $primary-shadow-dark;
    border: 1px solid $white;
    border-radius: 50%;
  }
}
</style>
