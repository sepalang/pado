import { isNumber, limitNumber, isAbsoluteNaN } from "../functions"

export const Limitter = function (max, min){
  this.value = 0
  if(typeof max !== "number" || isAbsoluteNaN(min)){
    this.maximum = Number.POSITIVE_INFINITY
  } else {
    this.maximum = max
  }
  if(typeof min !== "number" || isAbsoluteNaN(min)){
    this.minimum = 0
  } else {
    this.minimum = min
  }
}

const LimitterPrototype = {
  expectIn (setValue){
    return setValue === limitNumber(setValue, this.maximum, this.minimum)
  },
  expectOut (setValue){
    return setValue !== limitNumber(setValue, this.maximum, this.minimum)
  },
  addExpectIn: function (addValue){
    const destValue = this.value + addValue
    return destValue === limitNumber(destValue, this.maximum, this.minimum)
  },
  addExpectOut: function (addValue){
    const destValue = this.value + addValue
    return destValue !== limitNumber(destValue, this.maximum, this.minimum)
  },
  set: function (setValue){
    this.value = setValue
    return this
  },
  add: function (addValue){
    this.value = this.value + addValue
    return this
  }
}

Object.defineProperties(LimitterPrototype, {
  done: {
    get (){
      return this.value === limitNumber(this.value, this.maximum, this.minimum)
    }
  }
})

Limitter.prototype = LimitterPrototype

export const ranger = function (max, min){
  return new Limitter(max, min)
}
