<template>
  <div class="v-pado-slider">
    <div class="v-pado-slider-scrollbar"></div>
    <div class="v-pado-slider-scroller"></div>
  </div>
</template>
<script>
import $ from '../../../../../.src/web/plugins/jquery';
import { dragHelper } from '../../../../../.src/web';
import { limitOf, domainRangeValue } from '../../../../../.src/functions';

export default {
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    maxValue: {
      type: [String, Number],
      default: 100
    },
    minValue: {
      type: [String, Number],
      default: 0
    },
    inputCycle: {
      default: 'change'
    }
  },
  computed: {
    xValue () {
      return parseInt(this.value, 10);
    },
    xMax () {
      return parseInt(this.maxValue, 10);
    },
    xMin () {
      return parseInt(this.minValue, 10);
    },
    readOnly () {
      return typeof this.$el.getAttribute('readOnly') === 'string';
    }
  },
  mounted () {
    const $element = $(this.$el);
    // const $scrollbar = $element.find('.v-pado-slider-scrollbar')
    const $scroller = $element.find('.v-pado-slider-scroller');

    this.$on('enter', (value) => {
      const modelValue = typeof value === 'number' ? value : this.xValue;
      const barLength = $element.width() - $scroller.width();
      const leftPosition = domainRangeValue([this.xMin, this.xMax], [0, barLength], modelValue);
      $scroller.css('left', leftPosition);
    });

    (typeof this.xValue !== 'undefined' || !this.xValue === 0) && this.$emit('enter', parseInt(this.xValue, 10));

    this.$watch('value', (newValue) => {
      this.$emit('enter', newValue);
    });

    this.windowResizeHandle = () => {
      this.$emit('enter');
    };

    $(window).on('resize', this.windowResizeHandle);

    dragHelper(this.$el, ({ element }) => {
      $scroller.css('pointer-events', 'none');
      let finalValue;
      return {
        'start, move': ({ event }) => {
          if (this.readOnly) {
            event.preventDefault();
          }

          let { left, width } = $scroller.predict({center: event}, element);

          const barLength = element.width() - width;
          const leftValue = limitOf(left, barLength);
          finalValue = Math.round(domainRangeValue([0, barLength], [this.xMin, this.xMax], leftValue));
          this.$emit('enter', finalValue);
          if (this.inputCycle === 'enter') {
            this.$emit('input', finalValue);
          }
        },
        end: ({ pointer }) => {
          const endValue = Math.round(typeof finalValue === 'number' ? finalValue : this.xValue);
          this.$emit('input', endValue);
        }
      };
    });
  },
  destroyed () {
    $(window).off('resize', this.windowResizeHandle);
  }
};
</script>
