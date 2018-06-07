import { 
  storiesOf, 
  FunctionGuide,
  text,
  methodIOInputParams
} from '../util';

import UsageComponentSlider from '../pages/UsageComponentSlider.vue';
import UsageComponentCircle from '../pages/UsageComponentCircle.vue';

storiesOf('Usage|component', module)
.add('slider',() => {
  return {
    render: h => h(UsageComponentSlider, { props: {} }),
    mixins:[],
    computed:{
    }
  };
})
.add('circle',() => {
  return {
    render: h => h(UsageComponentCircle, { props: {} }),
    mixins:[],
    computed:{
    }
  };
})