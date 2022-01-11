import { isArray } from './isLike'
import { toNumber } from './cast'

export const dateExp = function (dv, format){
  if(isArray(dv)) dv = dv.join(' ')

  var dt = /(\d\d\d\d|)[^\d]?(\d\d|\d|).?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)/.exec(dv)
  dt[1] = dt[1] || (((new Date()).getYear() + 1900) + '')
  dt[2] = dt[2] || ((new Date()).getMonth() + 1)
  dt[3] = dt[3] || ((new Date()).getDate())
  dt[4] = dt[4] || ("00")
  dt[5] = dt[5] || ("00")
  dt[6] = dt[6] || ("00")

  var r = [ dt[1], dt[2], dt[3], dt[4], dt[5], dt[6], dt[0] ]
  Object.defineProperties(r, {
    year  : { enumerable: false, value: dt[1] },
    month : { enumerable: false, value: dt[2] },
    date  : { enumerable: false, value: dt[3] },
    hour  : { enumerable: false, value: dt[4] },
    minute: { enumerable: false, value: dt[5] },
    second: { enumerable: false, value: dt[6] },
    init  : { enumerable: false, value: dt[7] },
    format: {
      enumerable: false,
      get       : ()=>function (s){
        return s.replace('YYYY', r.year).replace(/(MM|M)/, r.month).replace(/(DD|D)/, r.date)
        .replace(/(hh|h)/, r.hour).replace(/(mm|m)/, r.minute).replace(/(ss|s)/, r.second)
        .replace(/(A)/, (toNumber(r.hour) > 12) ? 'PM' : 'AM')
      }
    }
  })
  if(typeof format === 'string'){ return r.format(format) }
  return r
}

export const timestampExp = function (exp){
  if(arguments.length === 0){
    return (+new Date())
  }
  if(typeof exp === "string"){
    exp = dateExp(exp)
  }
  if(typeof exp === "number"){
    return exp
  }
  if(isArray(exp) && (exp.length == 7)){
    exp = new Date(exp[0], exp[1], exp[2], exp[3], exp[4], exp[5])
  }
  if(exp instanceof Date){
    return (+exp)
  }
  return 0
}

export const timescaleExp = function (exp){
  var scale = 0
  if(typeof exp === "number"){
    return exp
  }
  if(typeof exp === "string"){
    // destructure 00:00:00 
    exp = exp.replace(/(\d+|)\:(\d+|)\:(\d+|)/, function (t) {
      const [h, m, s] = t.split(":");
      return `${h || '0'}h ${m || '0'}m ${s || '0'}s`
    })
    //
    exp = exp.replace(/\d+(Y|year)/, function (t){
      t.replace(/\d+/, function (d){ scale += d * 31536000000 })
      return ""
    })
    exp = exp.replace(/\d+(M|month)/, function (t){
      t.replace(/\d+/, function (d){ scale += d * 2678400000 })
      return ""
    })
    exp = exp.replace(/\d+(D|day)/, function (t){
      t.replace(/\d+/, function (d){ scale += d * 86400000 })
      return ""
    })
    exp = exp.replace(/\d+(h|hour)/, function (t){
      t.replace(/\d+/, function (d){ scale += d * 3600000 })
      return ""
    })
    exp = exp.replace(/\d+(ms|millisecond)/, function (t){
      t.replace(/\d+/, function (d){ scale += d * 1 })
      return ""
    })
    exp = exp.replace(/\d+(m|minute)/, function (t){
      t.replace(/\d+/, function (d){ scale += d * 60000 })
      return ""
    })
    exp = exp.replace(/\d+(s|second)/, function (t){
      t.replace(/\d+/, function (d){ scale += d * 1000 })
      return ""
    })
  }
  return scale
}

export const datescaleExp = function(timescale){
  const sys = {
    year:0,
    month:0,
    day:0,
    hour:0,
    minute:0,
    second:0,
    millisecond:0,
  }
  let value = timescaleExp(timescale)

  const divYear = value / 31536000000 ;
  if(divYear >= 1){
    sys.year = parseInt(divYear)
    value = value % 31536000000
  }

  const divMonth = value / 2678400000 ;
  if(divMonth >= 1){
    sys.month = parseInt(divMonth)
    value = value % 31536000000
  }

  const divDay = value / 86400000 ;
  if(divDay >= 1){
    sys.day = parseInt(divDay)
    value = value % 86400000
  }

  const divHour = value / 3600000 ;
  if(divHour >= 1){
    sys.hour = parseInt(divHour)
    value = value % 3600000
  }

  const divYear = value / 60000 ;
  if(divMinute >= 1){
    sys.minute = parseInt(divMinute)
    value = value % 60000
  }

  const divSecond = value / 60000 ;
  if(divSecond >= 1){
    sys.second = parseInt(divSecond)
    value = value % 31536000000
  }

  sys.millisecond = value;
  
  return Object.defineProperties({}, {
    year:{
      enumerable:true,
      set:()=>{},
      get:()=>{
        return sys.year
      }
    },
    month:{
      enumerable:true,
      set:()=>{},
      get:()=>{
        return sys.month
      }
    },
    date:{
      enumerable:true,
      set:()=>{},
      get:()=>{
        return sys.day
      }
    },
    day:{
      enumerable:true,
      set:()=>{},
      get:()=>{
        return sys.day
      }
    },
    hour:{
      enumerable:true,
      set:()=>{},
      get:()=>{
        return sys.hour
      }
    },
    minute:{
      enumerable:true,
      set:()=>{},
      get:()=>{
        return sys.minute
      }
    },
    second:{
      enumerable:true,
      set:()=>{},
      get:()=>{
        return sys.second
      }
    },
    millisecond:{
      enumerable:true,
      set:()=>{},
      get:()=>{
        return sys.millisecond
      }
    },
    with:{
      enumerable:false,
      value:function(fn){
        return fn(this)
      }
    }
  })
} 
