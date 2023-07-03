<script lang="ts">
import { OPagination } from '@oruga-ui/oruga'

export default {
  extends: OPagination,
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_helpers.scss';
@import '@oruga-ui/oruga/src/scss/components/_pagination.scss';

.o-pag__link--current {
  @include ktheme() {
    background: theme('k-primary');
  }
}
</style>
