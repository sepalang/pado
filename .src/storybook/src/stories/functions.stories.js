import { storiesOf } from '@storybook/vue';
import { withKnobs, text } from '@storybook/addon-knobs/vue';
import FunctionIO from './FunctionIO.vue';
const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';


storiesOf('Function|cast', module)
.addDecorator(withKnobs)
.add(
  'asArray',
  () => {
    const input = text('Name', `"Input value"`);
    const { asArray } = require("../../../src/functions/cast");
    return {
      render:h=>h(FunctionIO,{
        props:{
          "inputText":input,
          "function":asArray
        }
      }),
      template: `<div>Parameters are </div>`
    }
  }
);
