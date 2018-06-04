import { 
  storiesOf, 
  FunctionGuide,
  text,
  methodIOInputParams
} from '../util';

import UsageComponentSlider from '../pages/UsageComponentSlider.vue';

storiesOf('Usage|component', module)
.add('slider',() => {
  
  const { dateExp } = require("../../../../.src/functions/datetime");
  
  return {
    render: h => h(UsageComponentSlider, { props: {} }),
    mixins:[],
    computed:{
    }
  };
})