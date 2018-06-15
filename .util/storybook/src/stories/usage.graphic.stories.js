import { 
  storiesOf, 
  FunctionGuide,
  text,
  methodIOInputParams
} from '../util';

import UsageComponentDOMBounds from '../pages/UsageComponentDOMBounds.vue';
import UsageComponentDOMLine from '../pages/UsageComponentDOMLine.vue';

storiesOf('Usage|graphic', module)
.add('DOMBounds',() => {
  return {
    render: h => h(UsageComponentDOMBounds, { props: {} })
  };
})
.add('DOMLine',() => {
  return {
    render: h => h(UsageComponentDOMLine, { props: {} })
  };
})