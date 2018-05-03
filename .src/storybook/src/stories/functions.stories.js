import { storiesOf } from '@storybook/vue';
import { withKnobs, text, selectParam, params } from '../util/selectParam';
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
        defaultCommand:()=>text('command',`
          asArray(i0);
        `.trim()),
        defaultScope:()=>({ asArray }),
        //multi
        inputParams (){
          return [
            {
              title:"String",
              params:params("String",[
                `"Input value"`
              ])
            },
            {
              title:"Boolean",
              params:params("Boolean",[
                `true`
              ])
            },
            {
              title:"null",
              params:params("Null",[
                `null`
              ])
            }
          ];
        },
        //single
        inputText:()=>selectParam("JSON",[
          `"Input value"`,
          `123`,
          `undefined`
        ])
      },
      template:`
        <div>
          <p v-if="!defaultCommand">Undefined defaultCommand</p>
          <p v-if="!defaultScope">Undefined defaultScope</p>
          <section>
            <h2>SINGLE</h2>
            <MethodIO :command="defaultCommand" :input-text="inputText" :scope="defaultScope"></MethodIO>
          </section>
          <section>
            <h2>Multi</h2>
          </section>
          <section v-for="param in inputParams">
            <h2 v-if="param.title">{{param.title}}</h2>
            <MethodIO :command="param.command || defaultCommand" :input-params="param.params" :scope="param.scope || defaultScope"></MethodIO>
          </section>
        </div>
      `
    }
  }
);
