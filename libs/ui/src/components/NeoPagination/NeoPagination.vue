<script lang="ts">
import { OPagination } from '@oruga-ui/oruga-next'

export default {
  extends: OPagination,
  props: {
    iconPack: {
      type: String,
      default: 'fasr',
    },
  },
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_helpers.scss';
@import '@oruga-ui/oruga-next/src/scss/components/_pagination.scss';

.o-pag__link--current {
  @include ktheme() {
    background: theme('k-primary');
  }
}
</style>
