import { affect } from '../../../../../../.src/modules'

export default function ({ name = '' } = {}) {
  const HighOrderMixins = {
    props: ['value'],
    data: () => ({ selected: false }),
    methods: {
      selectItem () {
        this.$parent.$emit('select-item-select-action', this.value)
      }
    },
    created () {
      const affectSelectedAttribute = affect(selectedValue => {
        this.selected = selectedValue
      })

      this.$on('inherit-select-state', ({ isSelectedValue }) => {
        affectSelectedAttribute(isSelectedValue(this.value))
      })
    },
    mounted () {
      this.$el.addEventListener('click', ({ currentTarget }) => {
        if (typeof currentTarget.getAttribute('disabled') === 'string') return
        if (typeof currentTarget.getAttribute('readOnly') === 'string') return
        this.selectItem()
      })

      this.$parent && this.$parent.$emit('select-item-mounted', this)
    }
  }

  return HighOrderMixins
}
