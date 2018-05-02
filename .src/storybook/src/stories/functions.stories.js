import { storiesOf } from '@storybook/vue';
import { withKnobs, text, selectParam } from '../util/selectParam';
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
        inputCommand:()=>text('command',`
          asArray(input);
        `.trim()),
        inputText:()=>selectParam("JSON",[
          `"Input value"`,
          `123`,
          `true`,
          `undefined`,
          `null`
        ]),
        scope:()=>({ asArray })
      },
      template:`
        <div>
          <MethodIO :command="inputCommand" :input-text="inputText" :scope="scope"></MethodIO>
        </div>
      `
    }
  }
);
