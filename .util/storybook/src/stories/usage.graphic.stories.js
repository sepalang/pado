import { 
  storiesOf, 
  FunctionGuide,
  text,
  methodIOInputParams
} from '../util';

import UsageComponentDOMBounds from '../pages/UsageComponentDOMBounds.vue';

storiesOf('Usage|graphic', module)
.add('DOMBounds',() => {
  return {
    render: h => h(UsageComponentDOMBounds, { props: {} })
  };
})