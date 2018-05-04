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
.add('timestampExp',() => {
  //timescaleExp
  
  const { timestampExp } = require("../../../src/functions/datetime");
  return {
    mixins:[FunctionGuide],
    computed:{
      defaultScope:()=>({ timestampExp }),
      defaultCommand:()=>text('Command',`timestampExp(i0);`),
      inputParams:()=>([
        methodIOInputParams("Now",[],{ command:text("Now command","timestampExp();") }),
        methodIOInputParams("Date format",[
          `"2018-01-01"`
        ]),
        methodIOInputParams("Date time",[
          `"2018-01-02 12:50:44"`
        ])
      ])
    }
  };
})
.add('timescaleExp',() => {
  const { timescaleExp } = require("../../../src/functions/datetime");
  return {
    mixins:[FunctionGuide],
    computed:{
      defaultScope:()=>({ timescaleExp }),
      defaultCommand:()=>text('Command',`timescaleExp(i0);`),
      inputParams:()=>([
        methodIOInputParams("Now",[],{ command:text("Now command","timescaleExp();") }),
        methodIOInputParams("2 Years",[
          `"2Y"`
        ]),
        methodIOInputParams("3 minute",[
          `"3m"`
        ]),
        methodIOInputParams("1:11:11",[
          `"1h11m11s"`
        ]),
        methodIOInputParams("1:11:11.111",[
          `"1h11m11s111ms"`
        ])
      ])
    }
  };
})