/*
const timeline = timeline({ fps:60 })

timeline.into(
  projection([],{
    begin (){
      
    },
    reach (){
      
    },
    enter (){
      
    },
    update (self,time){
      
    },
    exit (){
      
    }
  })
);

projection($(".ds")[0]).update();
*/

/*
import { randRange } from '../../functions/random'

import { timeline, timeProperties } from './'


const timeline = timeline({ fps:60 });

timeline.addProperty(
  timeProperties({title:"foo"}).push("4h",[
    {x:randRange([20, 40]),y:randRange([35, 65])},
    {x:randRange([20, 40]),y:randRange([35, 65])},
    {x:randRange([20, 40]),y:randRange([35, 65])},
  ]),
  0
);

timeline.$on({
  start (){
    console.log("start timeline")
  },
  move (){
    console.log("move timeline")
  },
  end (){
    console.log("end timeline")
  }
})

timeline.play();
*/

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.example = mod.exports;
  }
})(this, function () {
  "use strict";
});
//# sourceMappingURL=example.js.map