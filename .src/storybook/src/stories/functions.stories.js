import { storiesOf } from '@storybook/vue';
import { withKnobs, selectParam } from '../util/selectParam';
import MethodIO from './MethodIO.vue';

storiesOf('Function|cast', module)
.addDecorator(withKnobs)
.add(
  'asArray',() => {
    const { asArray } = require("../../../src/functions/cast");
    return {
      components:{
        MethodIO
      },
      computed:{
        inputText:()=>selectParam("JSON",[
          `"Input value"`,
          `undefined`,
          `null`
        ]),
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
