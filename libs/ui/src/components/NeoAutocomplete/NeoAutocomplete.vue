<script lang="ts">
import { OAutocomplete } from '@oruga-ui/oruga-next'

export default {
  extends: OAutocomplete,
  props: {
    iconPack: {
      type: String,
      default: 'fasr',
    },
  },
}
</script>

<style lang="scss">
@import './NeoAutocomplete.scss';
</style>
