import { 
  storiesOf, 
  FunctionGuide,
  text,
  methodIOInputParams
} from '../util';

import UsageComponentSlider from '../pages/UsageComponentSlider.vue';
import UsageComponentRect from '../pages/UsageComponentRect.vue';
import UsageComponentCircle from '../pages/UsageComponentCircle.vue';
import UsageComponentSelectItem from '../pages/UsageComponentSelectItem.vue';


storiesOf('Usage|component', module)
.add('slider',() => {
  return {
    render: h => h(UsageComponentSlider, { props: {} })
  };
})
.add('rect',() => {
  return {
    render: h => h(UsageComponentRect, { props: {} })
  };
})
.add('circle',() => {
  return {
    render: h => h(UsageComponentCircle, { props: {} })
  };
})
.add('select+item',() => {
  return {
    render: h => h(UsageComponentSelectItem, { props: {} })
  };
})