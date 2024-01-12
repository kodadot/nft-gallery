<script lang="ts">
import { OSlider } from '@oruga-ui/oruga-next'

export default {
  extends: OSlider,
}
</script>

<style lang="scss">
@import '@oruga-ui/theme-oruga/dist/scss/utils/_variables.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_animations.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_helpers.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_root.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_base.scss';

@import '@oruga-ui/theme-oruga/dist/scss/components/_slider.scss';

.o-slide__fill {
  @apply bg-k-primary;
}
</style>
