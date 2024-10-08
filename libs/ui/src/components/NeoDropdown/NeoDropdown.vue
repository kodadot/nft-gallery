<script>
import { ODropdown } from '@oruga-ui/oruga-next'
import { useElementBounding } from '@vueuse/core'

export default {
  mixins: [ODropdown],
  props: {
    mobileModal: {
      type: Boolean,
      default: false,
    },
    noShadow: {
      type: Boolean,
      default: false,
    },
    closeMenuOnMove: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      validator: (value) => {
        return (
          [
            'top-right',
            'top-left',
            'bottom-left',
            'bottom-right',
            'bottom-auto',
          ].indexOf(value) > -1
        )
      },
    },
  },
  data() {
    return {
      autoPosition: '',
    }
  },
  computed: {
    rootClasses() {
      return [
        'neo-dropdown',
        this.computedClass('rootClass', 'o-drop'),
        {
          [this.computedClass('disabledClass', 'o-drop--disabled')]:
            this.disabled,
        },
        {
          [this.computedClass('expandedClass', 'o-drop--expanded')]:
            this.expanded,
        },
        { [this.computedClass('inlineClass', 'o-drop--inline')]: this.inline },
        {
          [this.computedClass('mobileClass', 'o-drop--mobile')]:
            this.isMobileModal && this.isMatchMedia && !this.hoverable,
        },
      ]
    },
    menuClasses() {
      return [
        this.computedClass('menuClass', 'o-drop__menu'),
        {
          [this.computedClass(
            'menuPositionClass',
            'o-drop__menu--',
            this.autoPosition,
          )]: this.autoPosition,
        },
        {
          [this.computedClass('menuActiveClass', 'o-drop__menu--active')]:
            this.isActive || this.inline,
        },
        {
          [this.computedClass('menuShadowClass', 'no-shadow')]: this.noShadow,
        },
        {
          [this.computedClass(
            'menuScrollableClass',
            'o-drop__menu--scrollable',
          )]: this.scrollable,
        },
      ]
    },
    isAutoPosition() {
      return this.position?.includes('auto')
    },
  },
  mounted() {
    if (this.isAutoPosition) {
      this.calcDropdownPosition()
      window.addEventListener('resize', this.calcDropdownPosition)
    }
    else {
      this.autoPosition = this.position
    }
    if (this.closeMenuOnMove) {
      watch(useElementBounding(this.$refs.trigger).top, this.onTriggerMove)
    }
  },
  onBeforeUnmount() {
    window.removeEventListener('resize', this.calcDropdownPosition)
  },
  methods: {
    calcDropdownPosition() {
      // support pass `position` type of `top-auto` or `bottom-auto`
      // calc the dropdown position based on the trigger position
      const ele = this.$refs.trigger
      const side
        = ele?.getBoundingClientRect().left < window.innerWidth / 2
          ? 'right'
          : 'left'
      this.autoPosition = this.position.replace('auto', side)
    },
    onTriggerMove() {
      if (this.isActive) {
        this.isActive = false
      }
    },
  },
}
</script>

<style lang="scss">
@import './NeoDropdown.scss';
</style>
