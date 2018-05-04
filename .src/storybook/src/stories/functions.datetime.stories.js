import { 
  storiesOf, 
  FunctionGuide,
  text,
  methodIOInputParams
} from '../util';


storiesOf('Function|datetime', module)
.add('dateExp',() => {
  //dateExp
  //timestampExp
  //timescaleExp
  
  const { dateExp } = require("../../../src/functions/datetime");
  return {
    mixins:[FunctionGuide],
    computed:{
      defaultScope:()=>({ dateExp }),
      defaultCommand:()=>text('Command',`dateExp(i0,i1);`),
      inputParams:()=>([
        methodIOInputParams("YYYY-MM-DD",[
          `"2018-01-01"`,
          undefined
        ]),
        methodIOInputParams("YYYY-MM-DD format",[
          `"2018-01-02"`,
          `"YYYY_MM_DD"`
        ])
      ])
    }
  };
})