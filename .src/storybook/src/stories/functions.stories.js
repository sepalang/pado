import { storiesOf } from '@storybook/vue';
import { withKnobs, text } from '@storybook/addon-knobs/vue';
import MethodIO from './MethodIO.vue';

storiesOf('Function|cast', module)
.addDecorator(withKnobs)
.add(
  'asArray',
  () => {
    const input = text('Name', `"Input value"`);
    const { asArray } = require("../../../src/functions/cast");
    return {
      components:{
        MethodIO
      },
      computed:{
        inputText:()=>input,
        method:()=>asArray
      },
      template:`
        <div>
          <p>root :{{ {inputText, method} }}</p>
          
          <MethodIO :input-text="inputText" :method="method"></MethodIO>
        </div>
      `
    }
  }
);
