<script lang="ts">
import { OCarousel } from '@oruga-ui/oruga-next'

export default {
  extends: OCarousel,
  props: {
    iconPack: {
      type: String,
      default: 'fasr',
    },
  },
}
</script>

<style lang="scss">
@import '@oruga-ui/theme-oruga/dist/scss/utils/_variables.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_animations.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_helpers.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_root.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_base.scss';

$carousel-indicators-background: inherit;

@import '@oruga-ui/theme-oruga/dist/scss/components/_carousel.scss';
</style>
