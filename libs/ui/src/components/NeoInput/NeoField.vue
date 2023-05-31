<script lang="ts">
import { OField } from '@oruga-ui/oruga'

export default {
  mixins: [OField],
  computed: {
    classes() {
      return ['neo-field']
    },
  },
}
</script>

<style lang="scss">
@import './NeoInput.scss';
</style>
