<script lang="ts">
import { OTable } from '@oruga-ui/oruga'

export default {
  extends: OTable,
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_helpers.scss';

$table-border: 0;
$table-border-radius: 0;
$table-th-border: 0;
$table-td-border: 0;
$table-th-font-weight: 400;
$table-th-color: #999999;

@import '@oruga-ui/oruga/src/scss/components/_table.scss';
</style>
