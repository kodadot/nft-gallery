<script>
import { ODropdownItem } from '@oruga-ui/oruga-next'

export default {
  mixins: [ODropdownItem],
  computed: {
    rootClasses() {
      return [
        'neo-dropdown-item',
        this.computedClass('itemClass', 'o-drop__item'),
        {
          [this.computedClass('itemDisabledClass', 'o-drop__item--disabled')]:
            this.parent.disabled || this.disabled,
        },
        // {
        //   [this.computedClass('itemActiveClass', 'o-drop__item--active')]:
        //     this.isActive,
        // },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './NeoDropdown.scss';
</style>
