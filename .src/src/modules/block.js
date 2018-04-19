import {
  hasValue,
  reduce,
  select,
  cloneDeep,
  forMap,
  domainRangeValue
} from '../functions'

//Scale foundation
//정의역과 치역을 계산하여 결과값을 리턴함, 속성별로 정의하여 다중 차원 지원

const Block = function(posSize,syncOpt){
  this.$space = (void 0);
  this.$posSize;
  this.$mask;
          
  this.$compute;
  this.$sync;
  this.sync(posSize,syncOpt);
};
  
Block.prototype = {
  sync:function(block,syncOpt){ 
    if(!arguments.length && this.$sync){
      block = this.$sync();
    } else if(typeof block === "function"){
      this.$sync = block;
      if(syncOpt == true){
        block = this.$sync();
      } else {
        return this;
      }
    }
    if(block instanceof Block){ 
      this.$posSize = _cloneDeep(block.$posSize);
      //.. this.$sync    = this.$sync || block.$sync
      this.$space   = this.$space || block.$space; 
      this.$mask    = this.$mask  || block.$mask; 
    } else {
      this.$posSize = forMap(_cloneDeep(block),function(posSize){ return !_.isArray(posSize) ? [posSize, 0] : posSize; });
    }
    return this; 
  },
  clone:function(){ return new Block(this); },
  setPosition:function(value,sel){ var $posSize = select(this.$posSize,sel); if($posSize instanceof Array) $posSize[0] = value; return this;},
  setSize:function(value,sel){ var $posSize = select(this.$posSize,sel); if($posSize instanceof Array) $posSize[1] = value; return this; },
  get:function(){ return _cloneDeep(typeof this.$posSize === "function" ? this.$posSize() : this.$posSize); },
  domainValue:function(){ return forMap(_cloneDeep(this.get()),function(posSize){return posSize[0];}); },
  domainSize :function(){ return forMap(_cloneDeep(this.get()),function(posSize){return posSize[1];}); },
  domainMap:function(){
    return forMap(_cloneDeep(this.get()),function(posSize){
      return {
        start:posSize[0],
        size:posSize[1],
        end:posSize[0] + posSize[1]
      };
    });
  },
  conflicts:function(otherBlocks,selector){
    return reduce(otherBlocks,function(red,block){
      var selectOtherBlock = select(block,selector);
                  
      if(selectOtherBlock instanceof Block){
        //다른 블럭이 현재 블럭과 같거나 space가 다를때는 평가하지 않음
        if((selectOtherBlock === this) || (selectOtherBlock.$space != this.$space)) return red;
                      
        //
        var inspectResult = [];
                      
        forMap(this.get(),function(thisPos,key){
          var otherPos = select(selectOtherBlock.get(),key);
          if(otherPos[0] < thisPos[0] && (otherPos[0] + otherPos[1]) <= thisPos[0]) return inspectResult.push(false);
          if(otherPos[0] > thisPos[0] && (thisPos[0]  + thisPos[1])  <= otherPos[0]) return inspectResult.push(false);
          return inspectResult.push(true);
        });
                      
        if(inspectResult.length && !hasValue(inspectResult,false)){
          red.push(block);
        }
      }
      return red;
    }.bind(this),[]);
  },
  hasConflicts:function(otherBlocks,selector){ return !!this.conflicts(otherBlocks,selector).length; },
  overflow:function(mask){
    var blockPosSize  = this.get();
    var spaceDomain   = this.$space.getDomain();
    var overflowDomain = (mask && _cloneDeep(mask)) || (this.$space && this.$space.getDomain()) || [];
    return forMap(overflowDomain,function($overflowSelected,sel){
      var $posSize = select(blockPosSize,sel);
      var $domain  = select(spaceDomain,sel);
      return ( $posSize[0] < select($overflowSelected[0],$domain[0]) || ($posSize[0] + $posSize[1]) > select($overflowSelected[1],$domain[1]) );
    });
  },
  isOverflow:function(mask){
    var overflow = false;
    forMap(this.overflow(mask),function(f){ if(f){ overflow = true; } });
    return overflow;
  },
  maskOverflow:function(mask){ return this.overflow(this.$mask || mask); },
  isMaskOverflow:function(mask){ return this.isOverflow(this.$mask || mask); },
  rangeStart:function(){ return this.$space.domainRange(forMap(this.get(),function(posSize){ return posSize[0]; })); },
  rangeSize:function(){ return this.$space.domainRangeSize(forMap(this.get(),function(posSize){ return posSize[1]; })); },
  rangeMap:function(){
    var rangeSize = this.rangeSize();
              
    return forMap(this.rangeStart(),function($start,sel){ 
      var $size = sel ? rangeSize[sel] : rangeSize;
      return {
        start:$start,
        size:$size,
        end:$start+$size
      };
    }.bind(this));
  },
  map:function(){
    var domainMap  = this.domainMap();
    var rangeMap = this.rangeMap();
              
    var blockMap = forMap(rangeMap,function(map,key){
      map.rangeStart = map.start,
      map.rangeSize  = map.size,
      map.rangeEnd   = map.end;
                  
      var $domainMap  = select(domainMap,key);
      map.domainStart = $domainMap.start,
      map.domainSize  = $domainMap.size,
      map.domainEnd   = $domainMap.end;
      delete map.start;
      delete map.size;
      delete map.end;
      return map;
    });
              
    return blockMap;
  },
  rangeEnd:function(){ return this.rangeMap(this.rangeMap(),function(map){ return map.end; }); },
  compute:function(func){
    if(typeof func === "function"){ 
      this.$compute = func; 
    } else {
      this.$compute && this.$compute(this.map());
    } 
    return this; 
  },
  call:function(f){ typeof f === "function" && f.call(this,this.rangeMap()); }
};
      
const Tracker = function(space,domainMask){
  this.$space = space;
  this.$domainMask = forMap(_cloneDeep(domainMask),function(mask,sel){
    if(typeof mask === "number") mask = [mask];
    if(mask instanceof Array){
      if(!mask[0]) mask[0] = 0;
      if(!mask[1]) mask[1] = function(v){return v;};
    }
    return mask;
  });
};
      
Tracker.prototype = {
  block:function(posSize,syncOpt){ var block = new Block(posSize,syncOpt); 
    block.$space = this.$space; 
    block.$mask  = this.$domainMask; 
    return block;
  },
  domainBlock:function(cursor,callback){
    var domainGrid = forMap(this.$space.getRange(),function(range){ return range[2]; });
    var block      = this.block(forMap(this.$space.rangeDomain(cursor),function(cursorPoint,key){ return [cursorPoint,select(domainGrid,key)]; }));
    var blockMap   = block.map();
              
    callback && callback.call(block,blockMap,block);
    return block;
  }
};
      
const Space = function(domain,range){
  this.domain(domain);
  this.range(range);
  this.$niceDomain = true;
  this.$niceRange  = true;
};
      
Space.prototype = {
  domain:function(domain){
    //default grid scale
    domain = forMap(domain,function(domain){
      if(!domain[2]){ domain[2] = 1; }
      return domain;
    });
    this.$domain = domain;
  },
  range:function(range){
    range = forMap(range,function(range){
      if(!range[2]){ range[2] = 1; }
      return range;
    });
    this.$range = range;
  },
  getRange:function(){
    return forMap(_cloneDeep(this.$range),function(range){
      for(var i=0,l=range.length;i<l;i++) if(typeof range[i] === "function") range[i] = range[i]();
      return range;
    });
  },
  getDomain:function(){
    return forMap(_cloneDeep(this.$domain),function(domain){
      for(var i=0,l=domain.length;i<l;i++) if(typeof domain[i] === "function") domain[i] = domain[i]();
      return domain;
    });
  },
  domainRangeSize:function(vs){
    return forMap(vs,function(v,sel){
      var $range  = sel ? this.getRange()[sel]  : this.getRange();
      var $domain = sel ? this.getDomain()[sel] : this.getDomain();
      return (v / ($domain[1] - $domain[0])) * ($range[1] - $range[0]);
    }.bind(this));
  },
  domainRange:function(vs){ return domainRangeValue(this.getDomain(),this.getRange(),vs,this.$niceRange); },
  rangeDomain:function(vs){ return domainRangeValue(this.getRange(),this.getDomain(),vs,this.$niceDomain); },
  block:function(posSize,syncOpt){
    var block = new Block(posSize,syncOpt);
    block.$space = this;
    return block;
  },
  tracker:function(domainMask){
    var tracker = new Tracker(this,domainMask);
    return tracker;
  }
};
      
export const space = (function(){
  return function(domain,range){
    return new Space(domain,range);
  };
}());
  
export const block = (function(){
  return function(posSize,syncOpt){
    return new Block(posSize,syncOpt);
  };
}());