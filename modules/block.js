(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.functions);
    global.block = mod.exports;
  }
})(this, function (_exports, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.block = _exports.space = void 0;

  // ?
  var hasValueProperty = function hasValueProperty(obj, value, key) {
    if (arguments.length == 1 && likeObject(obj)) return isEmpty(obj);
    if (isArray(obj)) for (var i = 0, l = obj.length; i < l; i++) {
      if (obj[i] === value) return true;
    }

    if (likeObject(obj)) {
      if (key) {
        return (0, _functions.get)(obj, key) === value;
      } else {
        for (var key in obj) {
          if ((0, _functions.get)(obj, key) === value) return true;
        }
      }
    }

    return false;
  }; //Scale foundation
  //정의역과 치역을 계산하여 결과값을 리턴함, 속성별로 정의하여 다중 차원 지원


  var Block = function Block(posSize, syncOpt) {
    this.$space = void 0;
    this.$posSize;
    this.$mask;
    this.$compute;
    this.$sync;
    this.sync(posSize, syncOpt);
  };

  Block.prototype = {
    sync: function sync(block, syncOpt) {
      if (!arguments.length && this.$sync) {
        block = this.$sync();
      } else if (typeof block === "function") {
        this.$sync = block;

        if (syncOpt == true) {
          block = this.$sync();
        } else {
          return this;
        }
      }

      if (block instanceof Block) {
        this.$posSize = _cloneDeep(block.$posSize); //.. this.$sync    = this.$sync || block.$sync

        this.$space = this.$space || block.$space;
        this.$mask = this.$mask || block.$mask;
      } else {
        this.$posSize = (0, _functions.forMap)(_cloneDeep(block), function (posSize) {
          return !_.isArray(posSize) ? [posSize, 0] : posSize;
        });
      }

      return this;
    },
    clone: function clone() {
      return new Block(this);
    },
    setPosition: function setPosition(value, sel) {
      var $posSize = (0, _functions.get)(this.$posSize, sel);
      if ($posSize instanceof Array) $posSize[0] = value;
      return this;
    },
    setSize: function setSize(value, sel) {
      var $posSize = (0, _functions.get)(this.$posSize, sel);
      if ($posSize instanceof Array) $posSize[1] = value;
      return this;
    },
    get: function get() {
      return _cloneDeep(typeof this.$posSize === "function" ? this.$posSize() : this.$posSize);
    },
    domainValue: function domainValue() {
      return (0, _functions.forMap)(_cloneDeep(this.get()), function (posSize) {
        return posSize[0];
      });
    },
    domainSize: function domainSize() {
      return (0, _functions.forMap)(_cloneDeep(this.get()), function (posSize) {
        return posSize[1];
      });
    },
    domainMap: function domainMap() {
      return (0, _functions.forMap)(_cloneDeep(this.get()), function (posSize) {
        return {
          start: posSize[0],
          size: posSize[1],
          end: posSize[0] + posSize[1]
        };
      });
    },
    conflicts: function conflicts(otherBlocks, selector) {
      return (0, _functions.asArray)(otherBlocks).reduce(function (red, block) {
        var selectOtherBlock = (0, _functions.get)(block, selector);

        if (selectOtherBlock instanceof Block) {
          //다른 블럭이 현재 블럭과 같거나 space가 다를때는 평가하지 않음
          if (selectOtherBlock === this || selectOtherBlock.$space != this.$space) return red; //

          var inspectResult = [];
          (0, _functions.forMap)(this.get(), function (thisPos, key) {
            var otherPos = (0, _functions.get)(selectOtherBlock.get(), key);
            if (otherPos[0] < thisPos[0] && otherPos[0] + otherPos[1] <= thisPos[0]) return inspectResult.push(false);
            if (otherPos[0] > thisPos[0] && thisPos[0] + thisPos[1] <= otherPos[0]) return inspectResult.push(false);
            return inspectResult.push(true);
          });

          if (inspectResult.length && !hasValueProperty(inspectResult, false)) {
            red.push(block);
          }
        }

        return red;
      }.bind(this), []);
    },
    hasConflicts: function hasConflicts(otherBlocks, selector) {
      return !!this.conflicts(otherBlocks, selector).length;
    },
    overflow: function overflow(mask) {
      var blockPosSize = this.get();
      var spaceDomain = this.$space.getDomain();
      var overflowDomain = mask && _cloneDeep(mask) || this.$space && this.$space.getDomain() || [];
      return (0, _functions.forMap)(overflowDomain, function ($overflowSelected, sel) {
        var $posSize = (0, _functions.get)(blockPosSize, sel);
        var $domain = (0, _functions.get)(spaceDomain, sel);
        return $posSize[0] < (0, _functions.get)($overflowSelected[0], $domain[0]) || $posSize[0] + $posSize[1] > (0, _functions.get)($overflowSelected[1], $domain[1]);
      });
    },
    isOverflow: function isOverflow(mask) {
      var overflow = false;
      (0, _functions.forMap)(this.overflow(mask), function (f) {
        if (f) {
          overflow = true;
        }
      });
      return overflow;
    },
    maskOverflow: function maskOverflow(mask) {
      return this.overflow(this.$mask || mask);
    },
    isMaskOverflow: function isMaskOverflow(mask) {
      return this.isOverflow(this.$mask || mask);
    },
    rangeStart: function rangeStart() {
      return this.$space.domainRange((0, _functions.forMap)(this.get(), function (posSize) {
        return posSize[0];
      }));
    },
    rangeSize: function rangeSize() {
      return this.$space.domainRangeSize((0, _functions.forMap)(this.get(), function (posSize) {
        return posSize[1];
      }));
    },
    rangeMap: function rangeMap() {
      var rangeSize = this.rangeSize();
      return (0, _functions.forMap)(this.rangeStart(), function ($start, sel) {
        var $size = sel ? rangeSize[sel] : rangeSize;
        return {
          start: $start,
          size: $size,
          end: $start + $size
        };
      }.bind(this));
    },
    map: function map() {
      var domainMap = this.domainMap();
      var rangeMap = this.rangeMap();
      var blockMap = (0, _functions.forMap)(rangeMap, function (map, key) {
        map.rangeStart = map.start, map.rangeSize = map.size, map.rangeEnd = map.end;
        var $domainMap = (0, _functions.get)(domainMap, key);
        map.domainStart = $domainMap.start, map.domainSize = $domainMap.size, map.domainEnd = $domainMap.end;
        delete map.start;
        delete map.size;
        delete map.end;
        return map;
      });
      return blockMap;
    },
    rangeEnd: function rangeEnd() {
      return this.rangeMap(this.rangeMap(), function (map) {
        return map.end;
      });
    },
    compute: function compute(func) {
      if (typeof func === "function") {
        this.$compute = func;
      } else {
        this.$compute && this.$compute(this.map());
      }

      return this;
    },
    call: function call(f) {
      typeof f === "function" && f.call(this, this.rangeMap());
    }
  };

  var Tracker = function Tracker(space, domainMask) {
    this.$space = space;
    this.$domainMask = (0, _functions.forMap)(_cloneDeep(domainMask), function (mask, sel) {
      if (typeof mask === "number") mask = [mask];

      if (mask instanceof Array) {
        if (!mask[0]) mask[0] = 0;
        if (!mask[1]) mask[1] = function (v) {
          return v;
        };
      }

      return mask;
    });
  };

  Tracker.prototype = {
    block: function block(posSize, syncOpt) {
      var block = new Block(posSize, syncOpt);
      block.$space = this.$space;
      block.$mask = this.$domainMask;
      return block;
    },
    domainBlock: function domainBlock(cursor, callback) {
      var domainGrid = (0, _functions.forMap)(this.$space.getRange(), function (range) {
        return range[2];
      });
      var block = this.block((0, _functions.forMap)(this.$space.rangeDomain(cursor), function (cursorPoint, key) {
        return [cursorPoint, (0, _functions.get)(domainGrid, key)];
      }));
      var blockMap = block.map();
      callback && callback.call(block, blockMap, block);
      return block;
    }
  };

  var Space = function Space(domain, range) {
    this.domain(domain);
    this.range(range);
    this.$niceDomain = true;
    this.$niceRange = true;
  };

  Space.prototype = {
    domain: function domain(_domain) {
      //default grid scale
      _domain = (0, _functions.forMap)(_domain, function (domain) {
        if (!domain[2]) {
          domain[2] = 1;
        }

        return domain;
      });
      this.$domain = _domain;
    },
    range: function range(_range) {
      _range = (0, _functions.forMap)(_range, function (range) {
        if (!range[2]) {
          range[2] = 1;
        }

        return range;
      });
      this.$range = _range;
    },
    getRange: function getRange() {
      return (0, _functions.forMap)(_cloneDeep(this.$range), function (range) {
        for (var i = 0, l = range.length; i < l; i++) {
          if (typeof range[i] === "function") range[i] = range[i]();
        }

        return range;
      });
    },
    getDomain: function getDomain() {
      return (0, _functions.forMap)(_cloneDeep(this.$domain), function (domain) {
        for (var i = 0, l = domain.length; i < l; i++) {
          if (typeof domain[i] === "function") domain[i] = domain[i]();
        }

        return domain;
      });
    },
    domainRangeSize: function domainRangeSize(vs) {
      return (0, _functions.forMap)(vs, function (v, sel) {
        var $range = sel ? this.getRange()[sel] : this.getRange();
        var $domain = sel ? this.getDomain()[sel] : this.getDomain();
        return v / ($domain[1] - $domain[0]) * ($range[1] - $range[0]);
      }.bind(this));
    },
    domainRange: function domainRange(vs) {
      return (0, _functions.domainRangeValue)(this.getDomain(), this.getRange(), vs, this.$niceRange);
    },
    rangeDomain: function rangeDomain(vs) {
      return (0, _functions.domainRangeValue)(this.getRange(), this.getDomain(), vs, this.$niceDomain);
    },
    block: function block(posSize, syncOpt) {
      var block = new Block(posSize, syncOpt);
      block.$space = this;
      return block;
    },
    tracker: function tracker(domainMask) {
      var tracker = new Tracker(this, domainMask);
      return tracker;
    }
  };

  var space = function () {
    return function (domain, range) {
      return new Space(domain, range);
    };
  }();

  _exports.space = space;

  var block = function () {
    return function (posSize, syncOpt) {
      return new Block(posSize, syncOpt);
    };
  }();

  _exports.block = block;
});
//# sourceMappingURL=block.js.map