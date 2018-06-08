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