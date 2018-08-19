import {
  get,
  hashMap,
  domainRangeValue
} from '../functions'

import {
  isArray,
  likeObject,
  isEmpty
} from '../functions/isLike'

import {
  asArray,
  cloneDeep as _cloneDeep
} from '../functions/cast'

// ?
const hasValueProperty = function (obj, value, key){
  if(arguments.length == 1 && likeObject(obj)) return isEmpty(obj)
  if(isArray(obj)) for(var i = 0, l = obj.length; i < l; i++) if(obj[i] === value) return true
  if(likeObject(obj)){
    if(key){
      return get(obj, key) === value
    } else {
      for(var key in obj) if(get(obj, key) === value) return true
    }
  }
  return false
}


//Scale foundation
//정의역과 치역을 계산하여 결과값을 리턴함, 속성별로 정의하여 다중 차원 지원

const Block = function (posSize, syncOpt){
  Object.defineProperties(this, {
    $space     : { enumerable: false, writable: true, value: undefined },
    $posSize   : { enumerable: false, writable: true, value: undefined },
    $mask      : { enumerable: false, writable: true, value: undefined },
    $compute   : { enumerable: false, writable: true, value: undefined },
    $sync      : { enumerable: false, writable: true, value: undefined },
    domainValue: { 
      enumerable: true,
      get (){
        return hashMap(_cloneDeep(this.get()), function (posSize){ return posSize[0] })
      }
    },
    domainSize: { 
      enumerable: true,
      get (){
        return hashMap(_cloneDeep(this.get()), function (posSize){ return posSize[1] })
      }
    },
    rangeStart: { 
      enumerable: true,
      get (){
        return this.$space.domainRange(hashMap(this.get(), function (posSize){ return posSize[0] }))
      }
    },
    rangeSize: { 
      enumerable: true,
      get (){
        return this.$space.domainRangeSize(hashMap(this.get(), function (posSize){ return posSize[1] }))
      }
    }
  })
  
  this.sync(posSize, syncOpt)
}
  
const BlockPrototype = {}

Object.defineProperties(BlockPrototype, {
  domainMap: { 
    enumerable: false,
    get (){
      return hashMap(_cloneDeep(this.get()), function (posSize){
        return {
          start: posSize[0],
          size : posSize[1],
          end  : posSize[0] + posSize[1]
        }
      })
    }
  },
  rangeMap: { 
    enumerable: false,
    get (){
      const rangeSize = this.rangeSize
              
      return hashMap(this.rangeStart, function ($start, sel){ 
        var $size = sel ? rangeSize[sel] : rangeSize
        return {
          start: $start,
          size : $size,
          end  : $start + $size
        }
      })
    }
  },
  rangeEnd: { 
    enumerable: false,
    get (){
      return this.rangeMap(this.rangeMap, function (map){ return map.end })
    }
  }
})

Object.assign(BlockPrototype, {
  sync: function (block, syncOpt){ 
    if(!arguments.length && this.$sync){
      block = this.$sync()
    } else if(typeof block === "function"){
      this.$sync = block
      if(syncOpt == true){
        block = this.$sync()
      } else {
        return this
      }
    }
    if(block instanceof Block){ 
      this.$posSize = _cloneDeep(block.$posSize)
      //.. this.$sync    = this.$sync || block.$sync
      this.$space = this.$space || block.$space 
      this.$mask = this.$mask || block.$mask 
    } else {
      this.$posSize = hashMap(_cloneDeep(block), function (posSize){ return !isArray(posSize) ? [posSize, 0] : posSize })
    }
    return this 
  },
  clone      : function (){ return new Block(this) },
  setPosition: function (value, sel){ var $posSize = get(this.$posSize, sel); if($posSize instanceof Array) $posSize[0] = value; return this },
  setSize    : function (value, sel){ var $posSize = get(this.$posSize, sel); if($posSize instanceof Array) $posSize[1] = value; return this },
  get        : function (){ return _cloneDeep(typeof this.$posSize === "function" ? this.$posSize() : this.$posSize) },
  conflicts  : function (otherBlocks, selector){
    return asArray(otherBlocks).reduce(function (red, block){
      var selectOtherBlock = get(block, selector)
                  
      if(selectOtherBlock instanceof Block){
        //다른 블럭이 현재 블럭과 같거나 space가 다를때는 평가하지 않음
        if((selectOtherBlock === this) || (selectOtherBlock.$space != this.$space)) return red
                      
        //
        var inspectResult = []
                      
        hashMap(this.get(), function (thisPos, key){
          var otherPos = get(selectOtherBlock.get(), key)
          if(otherPos[0] < thisPos[0] && (otherPos[0] + otherPos[1]) <= thisPos[0]) return inspectResult.push(false)
          if(otherPos[0] > thisPos[0] && (thisPos[0] + thisPos[1]) <= otherPos[0]) return inspectResult.push(false)
          return inspectResult.push(true)
        })
                      
        if(inspectResult.length && !hasValueProperty(inspectResult, false)){
          red.push(block)
        }
      }
      return red
    }.bind(this), [])
  },
  hasConflicts: function (otherBlocks, selector){ return !!this.conflicts(otherBlocks, selector).length },
  overflow    : function (mask){
    var blockPosSize  = this.get()
    var spaceDomain   = this.$space.domain
    var overflowDomain = (mask && _cloneDeep(mask)) || (this.$space && this.$space.domain) || []
    return hashMap(overflowDomain, function ($overflowSelected, sel){
      var $posSize = get(blockPosSize, sel)
      var $domain  = get(spaceDomain, sel)
      return ($posSize[0] < get($overflowSelected[0], $domain[0]) || ($posSize[0] + $posSize[1]) > get($overflowSelected[1], $domain[1]))
    })
  },
  isOverflow: function (mask){
    var overflow = false
    hashMap(this.overflow(mask), function (f){ if(f){ overflow = true } })
    return overflow
  },
  maskOverflow  : function (mask){ return this.overflow(this.$mask || mask) },
  isMaskOverflow: function (mask){ return this.isOverflow(this.$mask || mask) },
  compute       : function (func){
    if(typeof func === "function"){ 
      this.$compute = func 
    } else {
      this.$compute && this.$compute(this.map())
    } 
    return this 
  },
  call: function (f){ typeof f === "function" && f.call(this, this.rangeMap) }
})

Block.prototype = BlockPrototype 
      
const Tracker = function (space, domainMask){
  this.$space = space
  this.$domainMask = hashMap(_cloneDeep(domainMask), function (mask, sel){
    if(typeof mask === "number") mask = [mask]
    if(mask instanceof Array){
      if(!mask[0]) mask[0] = 0
      if(!mask[1]) mask[1] = function (v){ return v }
    }
    return mask
  })
}
      
Tracker.prototype = {
  block: function (posSize, syncOpt){
    var block = new Block(posSize, syncOpt) 
    block.$space = this.$space 
    block.$mask = this.$domainMask 
    return block
  },
  domainBlock: function (cursor, callback){
    var domainGrid = hashMap(this.$space.range, function (range){ return range[2] })
    var block      = this.block(hashMap(this.$space.rangeDomain(cursor), function (cursorPoint, key){ return [cursorPoint, get(domainGrid, key)] }))
    var blockMap   = block.map()
              
    callback && callback.call(block, blockMap, block)
    return block
  }
}
      
const Space = function (domain, range){
  this.$niceDomain = true
  this.$niceRange = true
  
  Object.defineProperties(this, {
    $niceDomain: { enumerable: false, writable: true, value: true },
    $niceRange : { enumerable: false, writable: true, value: true },
    $domain    : { enumerable: false, writable: true, value: undefined },
    $range     : { enumerable: false, writable: true, value: undefined },
    domain     : {
      enumerable: true,
      set (domain){
        domain = hashMap(domain, function (domain){
          if(!domain[2]){ domain[2] = 1 }
          return domain
        })
        this.$domain = domain
      },
      get (){
        return hashMap(_cloneDeep(this.$domain), function (domain){
          for(var i = 0, l = domain.length; i < l; i++) if(typeof domain[i] === "function") domain[i] = domain[i]()
          return domain
        })
      }
    },
    range: {
      enumerable: true,
      set (range){
        range = hashMap(range, function (range){
          if(!range[2]){ range[2] = 1 }
          return range
        })
        this.$range = range
      },
      get (){
        return hashMap(_cloneDeep(this.$range), function (range){
          for(var i = 0, l = range.length; i < l; i++) if(typeof range[i] === "function") range[i] = range[i]()
          return range
        })
      }
    }
  })
  
  this.$domain = domain
  this.$range = range
}
      
Space.prototype = {
  domainRangeSize: function (vs){
    return hashMap(vs, function (v, sel){
      var $range  = sel ? this.range[sel] : this.range
      var $domain = sel ? this.domain[sel] : this.domain
      return (v / ($domain[1] - $domain[0])) * ($range[1] - $range[0])
    }.bind(this))
  },
  domainRange: function (vs){ return domainRangeValue(this.domain, this.range, vs, this.$niceRange) },
  rangeDomain: function (vs){ return domainRangeValue(this.range, this.domain, vs, this.$niceDomain) },
  block      : function (posSize, syncOpt){
    var block = new Block(posSize, syncOpt)
    block.$space = this
    return block
  },
  tracker: function (domainMask){
    var tracker = new Tracker(this, domainMask)
    return tracker
  }
}
      
export const space = (function (){
  return function (domain, range){
    return new Space(domain, range)
  }
}())
  
export const block = (function (){
  return function (posSize, syncOpt){
    return new Block(posSize, syncOpt)
  }
}())
