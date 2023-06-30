<script lang="ts">
import { OSlider } from '@oruga-ui/oruga'

export default {
  extends: OSlider,
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_helpers.scss';
@import '@oruga-ui/oruga/src/scss/components/_slider.scss';

.o-slide__fill {
  @include ktheme() {
    background: theme('k-primary');
  }
}
</style>
