<script lang="ts">
import { OUpload } from '@oruga-ui/oruga'

export default {
  extends: OUpload,
  computed: {
    rootClasses() {
      return [
        this.computedClass('rootClass', 'o-upl'),
        {
          [this.computedClass('expandedClass', 'o-upl--expanded')]:
            this.expanded,
        },
        {
          [this.computedClass('disabledClass', 'o-upl--disabled')]:
            this.disabled,
        },
        { 'o-upl--rounded': this.rounded },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './NeoUpload.scss';
</style>
