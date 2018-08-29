(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.object.assign", "../functions", "../functions/isLike", "../functions/cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.object.assign"), require("../functions"), require("../functions/isLike"), require("../functions/cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Object, global.functions, global.isLike, global.cast);
    global.block = mod.exports;
  }
})(this, function (_exports, _es6Object, _functions, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.block = _exports.space = void 0;

  // ?
  var hasValueProperty = function hasValueProperty(obj, value, key) {
    if (arguments.length == 1 && (0, _isLike.likeObject)(obj)) return (0, _isLike.isEmpty)(obj);
    if ((0, _isLike.isArray)(obj)) for (var i = 0, l = obj.length; i < l; i++) {
      if (obj[i] === value) return true;
    }

    if ((0, _isLike.likeObject)(obj)) {
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
    var _this = this;

    Object.defineProperties(this, {
      $space: {
        enumerable: false,
        writable: true,
        value: undefined
      },
      $posSize: {
        enumerable: false,
        writable: true,
        value: undefined
      },
      $mask: {
        enumerable: false,
        writable: true,
        value: undefined
      },
      $compute: {
        enumerable: false,
        writable: true,
        value: undefined
      },
      $sync: {
        enumerable: false,
        writable: true,
        value: undefined
      },
      domainValue: {
        enumerable: true,
        get: function get() {
          return (0, _functions.hashMap)((0, _cast.cloneDeep)(_this.get()), function (posSize) {
            return posSize[0];
          });
        }
      },
      domainSize: {
        enumerable: true,
        get: function get() {
          return (0, _functions.hashMap)((0, _cast.cloneDeep)(_this.get()), function (posSize) {
            return posSize[1];
          });
        }
      },
      rangeStart: {
        enumerable: true,
        get: function get() {
          return _this.$space.domainRange((0, _functions.hashMap)(_this.get(), function (posSize) {
            return posSize[0];
          }));
        }
      },
      rangeSize: {
        enumerable: true,
        get: function get() {
          return _this.$space.domainRangeSize((0, _functions.hashMap)(_this.get(), function (posSize) {
            return posSize[1];
          }));
        }
      }
    });
    this.sync(posSize, syncOpt);
  };

  var BlockPrototype = {};
  Object.defineProperties(BlockPrototype, {
    domainMap: {
      enumerable: false,
      get: function get() {
        return (0, _functions.hashMap)((0, _cast.cloneDeep)(this.get()), function (posSize) {
          return {
            start: posSize[0],
            size: posSize[1],
            end: posSize[0] + posSize[1]
          };
        });
      }
    },
    rangeMap: {
      enumerable: false,
      get: function get() {
        var rangeSize = this.rangeSize;
        return (0, _functions.hashMap)(this.rangeStart, function ($start, sel) {
          var $size = sel ? rangeSize[sel] : rangeSize;
          return {
            start: $start,
            size: $size,
            end: $start + $size
          };
        });
      }
    },
    rangeEnd: {
      enumerable: false,
      get: function get() {
        return this.rangeMap(this.rangeMap, function (map) {
          return map.end;
        });
      }
    }
  });
  Object.assign(BlockPrototype, {
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
        this.$posSize = (0, _cast.cloneDeep)(block.$posSize); //.. this.$sync    = this.$sync || block.$sync

        this.$space = this.$space || block.$space;
        this.$mask = this.$mask || block.$mask;
      } else {
        this.$posSize = (0, _functions.hashMap)((0, _cast.cloneDeep)(block), function (posSize) {
          return !(0, _isLike.isArray)(posSize) ? [posSize, 0] : posSize;
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
      return (0, _cast.cloneDeep)(typeof this.$posSize === "function" ? this.$posSize() : this.$posSize);
    },
    conflicts: function conflicts(otherBlocks, selector) {
      return (0, _cast.asArray)(otherBlocks).reduce(function (red, block) {
        var selectOtherBlock = (0, _functions.get)(block, selector);

        if (selectOtherBlock instanceof Block) {
          //다른 블럭이 현재 블럭과 같거나 space가 다를때는 평가하지 않음
          if (selectOtherBlock === this || selectOtherBlock.$space != this.$space) return red; //

          var inspectResult = [];
          (0, _functions.hashMap)(this.get(), function (thisPos, key) {
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
      var spaceDomain = this.$space.domain;
      var overflowDomain = mask && (0, _cast.cloneDeep)(mask) || this.$space && this.$space.domain || [];
      return (0, _functions.hashMap)(overflowDomain, function ($overflowSelected, sel) {
        var $posSize = (0, _functions.get)(blockPosSize, sel);
        var $domain = (0, _functions.get)(spaceDomain, sel);
        return $posSize[0] < (0, _functions.get)($overflowSelected[0], $domain[0]) || $posSize[0] + $posSize[1] > (0, _functions.get)($overflowSelected[1], $domain[1]);
      });
    },
    isOverflow: function isOverflow(mask) {
      var overflow = false;
      (0, _functions.hashMap)(this.overflow(mask), function (f) {
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
    compute: function compute(func) {
      if (typeof func === "function") {
        this.$compute = func;
      } else {
        this.$compute && this.$compute(this.map());
      }

      return this;
    },
    call: function call(f) {
      typeof f === "function" && f.call(this, this.rangeMap);
    }
  });
  Block.prototype = BlockPrototype;

  var Tracker = function Tracker(space, domainMask) {
    this.$space = space;
    this.$domainMask = (0, _functions.hashMap)((0, _cast.cloneDeep)(domainMask), function (mask, sel) {
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
      var domainGrid = (0, _functions.hashMap)(this.$space.range, function (range) {
        return range[2];
      });
      var block = this.block((0, _functions.hashMap)(this.$space.rangeDomain(cursor), function (cursorPoint, key) {
        return [cursorPoint, (0, _functions.get)(domainGrid, key)];
      }));
      var blockMap = block.map();
      callback && callback.call(block, blockMap, block);
      return block;
    }
  };

  var Space = function Space(domain, range) {
    this.$niceDomain = true;
    this.$niceRange = true;
    Object.defineProperties(this, {
      $niceDomain: {
        enumerable: false,
        writable: true,
        value: true
      },
      $niceRange: {
        enumerable: false,
        writable: true,
        value: true
      },
      $domain: {
        enumerable: false,
        writable: true,
        value: undefined
      },
      $range: {
        enumerable: false,
        writable: true,
        value: undefined
      },
      domain: {
        enumerable: true,
        set: function set(domain) {
          domain = (0, _functions.hashMap)(domain, function (domain) {
            if (!domain[2]) {
              domain[2] = 1;
            }

            return domain;
          });
          this.$domain = domain;
        },
        get: function get() {
          return (0, _functions.hashMap)((0, _cast.cloneDeep)(this.$domain), function (domain) {
            for (var i = 0, l = domain.length; i < l; i++) {
              if (typeof domain[i] === "function") domain[i] = domain[i]();
            }

            return domain;
          });
        }
      },
      range: {
        enumerable: true,
        set: function set(range) {
          range = (0, _functions.hashMap)(range, function (range) {
            if (!range[2]) {
              range[2] = 1;
            }

            return range;
          });
          this.$range = range;
        },
        get: function get() {
          return (0, _functions.hashMap)((0, _cast.cloneDeep)(this.$range), function (range) {
            for (var i = 0, l = range.length; i < l; i++) {
              if (typeof range[i] === "function") range[i] = range[i]();
            }

            return range;
          });
        }
      }
    });
    this.$domain = domain;
    this.$range = range;
  };

  Space.prototype = {
    domainRangeSize: function domainRangeSize(vs) {
      return (0, _functions.hashMap)(vs, function (v, sel) {
        var $range = sel ? this.range[sel] : this.range;
        var $domain = sel ? this.domain[sel] : this.domain;
        return v / ($domain[1] - $domain[0]) * ($range[1] - $range[0]);
      }.bind(this));
    },
    domainRange: function domainRange(vs) {
      return (0, _functions.domainRangeValue)(this.domain, this.range, vs, this.$niceRange);
    },
    rangeDomain: function rangeDomain(vs) {
      return (0, _functions.domainRangeValue)(this.range, this.domain, vs, this.$niceDomain);
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