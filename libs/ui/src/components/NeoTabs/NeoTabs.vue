<script>
import { OTabs } from '@oruga-ui/oruga-next'

export default {
  mixins: [OTabs],
  computed: {
    rootClasses() {
      return [
        this.computedClass('rootClass', 'o-tabs'),
        {
          [this.computedClass('positionClass', 'o-tabs--', this.position)]:
            this.position && this.vertical,
        },
        {
          [this.computedClass('expandedClass', 'o-tabs--fullwidth')]:
            this.expanded,
        },
        {
          [this.computedClass('verticalClass', 'o-tabs--vertical')]:
            this.vertical,
        },
        {
          [this.computedClass('multilineClass', 'o-tabs--multiline')]:
            this.multiline,
        },
        {
          [this.computedClass('navTypeClass', 'neo-tabs--', this.type)]:
            this.type,
        },
      ]
    },
  },
}
</script>
