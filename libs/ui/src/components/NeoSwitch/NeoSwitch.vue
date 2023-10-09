<script lang="ts">
import { OSwitch } from '@oruga-ui/oruga-next'

export default {
  extends: OSwitch,
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_helpers.scss';
@import '@oruga-ui/oruga-next/src/scss/components/_switch.scss';

.o-switch {
  &__check--checked {
    @include ktheme() {
      background-color: theme('k-primary');
    }
  }
}
</style>
