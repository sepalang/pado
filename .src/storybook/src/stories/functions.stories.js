import { 
  storiesOf, 
  PresetComponents, 
  text, 
  params 
} from '../util';

storiesOf('Function|cast', module)
.add(
  'asArray',() => {
    const { asArray } = require("../../../src/functions/cast");
    return {
      components:PresetComponents,
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
        }
      },
      template:`
        <div>
          <p v-if="!defaultCommand">Undefined defaultCommand</p>
          <p v-if="!defaultScope">Undefined defaultScope</p>
          <section v-for="param in inputParams">
            <h2 v-if="param.title">{{param.title}}</h2>
            <MethodIO :command="param.command || defaultCommand" :input-params="param.params" :scope="param.scope || defaultScope"></MethodIO>
          </section>
        </div>
      `
    }
  }
);
