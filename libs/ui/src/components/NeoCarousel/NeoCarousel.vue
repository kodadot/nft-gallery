<script lang="ts">
import { OCarousel } from '@oruga-ui/oruga-next'

export default {
  extends: OCarousel,
}
</script>

<style lang="scss">
@import '@oruga-ui/oruga-next/src/scss/utilities/expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/helpers.scss';

$carousel-indicators-background: inherit;

@import '@oruga-ui/oruga-next/src/scss/components/_carousel.scss';
</style>
