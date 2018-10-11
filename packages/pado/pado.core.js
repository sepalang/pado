import * as functions from './index.js'

let Bow  = function (){}
let BowFactory = function (fns){
  let BOX = function (payload){ return new Bow(payload) }
  
  function applyBoxFns (BowFns){ for(var name in BowFns) BOX[name] = BowFns[name] }
  
  applyBoxFns(fns)
  
  return BOX
}

let DEFAULT = BowFactory({ ...functions })

export const factory = BowFactory
export default DEFAULT
