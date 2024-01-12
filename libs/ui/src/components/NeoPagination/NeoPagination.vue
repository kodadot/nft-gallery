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
@import '@oruga-ui/theme-oruga/dist/scss/utils/_variables.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_animations.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_helpers.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_root.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_base.scss';
@import '@oruga-ui/theme-oruga/dist/scss/components/_pagination.scss';

.o-pag__link--current {
  @apply bg-k-primary;
}
</style>
