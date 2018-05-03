import { 
  storiesOf, 
  FunctionGuide,
  text,
  methodIOInputParams
} from '../util';


storiesOf('Function|cast', module)
.add('asArray',() => {
  const { asArray } = require("../../../src/functions/cast");
  return {
    mixins:[FunctionGuide],
    computed:{
      defaultScope:()=>({ asArray }),
      defaultCommand:()=>text('Command',`asArray(i0);`),
      inputParams:()=>([
        methodIOInputParams("String",[
          `"Input value"`
        ]),
        methodIOInputParams("Number",[
          `2018`
        ]),
        methodIOInputParams("Object",[
          `{foo:'bar'}`
        ]),
        methodIOInputParams("Array",[
          `[1,2,3,4]`
        ]),
        methodIOInputParams("null",[
          `null`
        ])
      ])
    }
  };
})
.add('asObject',() => {
  const { asObject } = require("../../../src/functions/cast");
  return {
    mixins:[FunctionGuide],
    computed:{
      defaultScope:()=>({ asObject }),
      defaultCommand:()=>text('Command',`asObject(i0);`),
      inputParams:()=>([
        methodIOInputParams("String",[
          `"Input value"`
        ]),
        methodIOInputParams("Number",[
          `2018`
        ]),
        methodIOInputParams("Object",[
          `{foo:'bar'}`
        ]),
        methodIOInputParams("Array",[
          `[1,2,3,4]`
        ]),
        methodIOInputParams("null",[
          `null`
        ])
      ])
    }
  };
})