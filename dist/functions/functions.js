(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["core-js/modules/es6.regexp.replace", "core-js/modules/es6.object.assign", "core-js/modules/es6.regexp.search", "core-js/modules/es6.regexp.match", "core-js/modules/es6.array.find-index", "core-js/modules/es6.regexp.split", "lodash/cloneDeep"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("core-js/modules/es6.regexp.replace"), require("core-js/modules/es6.object.assign"), require("core-js/modules/es6.regexp.search"), require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.array.find-index"), require("core-js/modules/es6.regexp.split"), require("lodash/cloneDeep"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.es6Regexp, global.es6Object, global.es6Regexp, global.es6Regexp, global.es6Array, global.es6Regexp, global.cloneDeep);
    global.functions = mod.exports;
  }
})(this, function (_es6Regexp, _es6Object, _es6Regexp2, _es6Regexp3, _es6Array, _es6Regexp4, _cloneDeep2) {
  "use strict";

  _cloneDeep2 = _interopRequireDefault(_cloneDeep2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var FUNCTION_EXPORTS = {};

  var IS_NULLIFY = FUNCTION_EXPORTS.IS_NULLIFY = function (data) {
    if (typeof data === "number") return isNaN(data);
    return data === undefined || data === null;
  };

  var IS_OBJECT = FUNCTION_EXPORTS.IS_OBJECT = function (object) {
    return object !== null && typeof object === "object" ? true : false;
  };

  var IS_ARRAY = FUNCTION_EXPORTS.IS_ARRAY = function (data) {
    return data instanceof Array;
  };

  var IS_FUNCTION = FUNCTION_EXPORTS.IS_FUNCTION = function (f) {
    return typeof f === "function";
  };

  var IS_NUMBER = FUNCTION_EXPORTS.IS_NUMBER = function (n) {
    return typeof n === "number" && !isNaN(n);
  };

  var IS_NUMBER_LIKE = FUNCTION_EXPORTS.IS_NUMBER_LIKE = function (t) {
    return typeof t === "number" ? true : typeof t === "string" ? parseFloat(t) + "" == t + "" : false;
  };

  var IS_NODE = FUNCTION_EXPORTS.IS_NODE = function (a) {
    return IS_OBJECT(a) && typeof a.nodeType === "number";
  };

  var IS_EMPTY = FUNCTION_EXPORTS.IS_EMPTY = function () {
    if (typeof o === "undefined") return true;
    if (typeof o === "string") return o.trim().length < 1 ? true : false;

    if (typeof o === "object") {
      if (o == null) return true;
      if (o instanceof RegExp) return false;

      if (IS_ARRAY(o)) {
        return !o.length;
      } else {
        for (var prop in o) {
          return false;
        }

        return true;
      }
    }

    if (typeof o === "number") return false;
    if (typeof o === "function") return false;
    if (typeof o === "boolean") return false;
    return true;
  };

  var IS_PATTERN = FUNCTION_EXPORTS.IS_PATTERN = function (s) {
    return typeof s === "string" || s instanceof RegExp;
  };

  var TO_ARRAY = FUNCTION_EXPORTS.TO_ARRAY = function (data, option) {
    if (typeof data === "undefined" || data === null || data === NaN) return [];
    if (IS_ARRAY(data)) return Array.prototype.slice.call(data);
    if (typeof data === "object" && typeof data.toArray === "function") return data.toArray();
    if (typeof data === "string", typeof option === "string") return data.split(option);
    return [data];
  };

  var AS_ARRAY = FUNCTION_EXPORTS.AS_ARRAY = function (data, defaultArray) {
    if (defaultArray === void 0) {
      defaultArray = undefined;
    }

    if (IS_ARRAY(data)) {
      return data;
    }

    if (IS_NULLIFY(data)) {
      return IS_ARRAY(defaultArray) ? defaultArray : IS_NULLIFY(defaultArray) ? [] : [defaultArray];
    }

    if (typeof data === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }

    return [data];
  };

  var IS_POSITIVE_PROP = FUNCTION_EXPORTS.IS_POSITIVE_PROP = function (value) {
    if (value === true) {
      return true;
    }

    if (value === false) {
      return false;
    }

    if (typeof value === "string" || typeof value === "number") {
      return true;
    } else {
      return false;
    }
  };

  var IS_NEGATIVE_PROP = FUNCTION_EXPORTS.IS_NEGATIVE_PROP = function (value) {
    return !IS_POSITIVE_PROP(value);
  };

  var INSTANCE = FUNCTION_EXPORTS.INSTANCE = function (func, proto) {
    var ins,
        DummyInstance = function DummyInstance(param) {
      if (typeof param === "object") for (var k in param) {
        this[k] = param[k];
      }
    };

    if (typeof func == "object") {
      if (typeof proto === "object") DummyInstance.prototype = proto;
      ins = new DummyInstance(func);
    }

    if (typeof func == "function") {
      if (typeof proto === "object") func.prototype = proto;
      ins = new func();
    }

    return ins;
  };

  var REFRESH_DATA = FUNCTION_EXPORTS.REFRESH_DATA = function (oldData, newData, getId, afterHook) {
    if (!/string|function/.test(typeof getId)) throw new Error("REFRESH_DATA need getId");

    if (typeof getId === "string") {
      var getIdString = getId;

      getId = function getId(e) {
        return _.get(e, getIdString);
      };
    }

    oldData = AS_ARRAY(oldData);
    newData = AS_ARRAY(newData);
    var result = [];

    var oldDataMap = _.map(oldData, function (e) {
      return {
        id: getId(e),
        ref: e
      };
    });

    _.each(newData, function (newDatum, i) {
      var newId = getId(newDatum);

      var oldDatum = _.get(oldDataMap[_.findIndex(oldDataMap, function (e) {
        return e.id === newId;
      })], "ref");

      var genDatum;
      var dirty = false;

      if (oldDatum) {
        // change is not dirty, modify is dirty
        if (typeof oldDatum !== typeof newDatum) {
          dirty = false;
        } else {
          // same type
          var oldOwnKeys = Object.keys(oldDatum).filter(function (key) {
            return !(key.indexOf("$") === 0);
          });
          var newOwnKeys = Object.keys(newDatum).filter(function (key) {
            return !(key.indexOf("$") === 0);
          }); //inspect key chnage

          if (_.isEqual(oldOwnKeys, newOwnKeys)) {
            dirty = !_.isEqual(_.pick(oldDatum, oldOwnKeys), _.pick(newDatum, newOwnKeys));
          } else {
            dirty = true;
          }
        }

        genDatum = _.assign({}, oldDatum, newDatum);
      } else {
        genDatum = _.assign({}, newDatum);
      }

      if (typeof afterHook === "function") {
        afterHook(genDatum, i, dirty);
      }

      result.push(genDatum);
    });

    return result;
  };

  var ALL = FUNCTION_EXPORTS.ALL = function (data, fn) {
    data = AS_ARRAY(data);

    if (data.length === 0) {
      return false;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      if (!fn(data[i], i)) {
        return false;
      }
    }

    ;
    return true;
  };

  var ALLOC = FUNCTION_EXPORTS.ALLOC = function (init) {
    var fn = init(),
        rn = function rn() {
      return fn.apply(this, Array.prototype.slice.call(arguments));
    };

    return rn.reset = function () {
      fn = init(rn, rn);
    }, rn.$originalFunction = fn, rn;
  };

  var UNIQUE = FUNCTION_EXPORTS.UNIQUE = function (array) {
    var value = [],
        result = [],
        array = TO_ARRAY(array);

    for (var i = 0, l = array.length; i < l; i++) {
      var unique = true;

      for (var i2 = 0, l2 = result.length; i2 < l2; i2++) {
        if (array[i] == result[i2]) {
          unique = false;
          break;
        }
      }

      if (unique == true) result.push(array[i]);
    }

    return result;
  };

  var HAS_VALUE = FUNCTION_EXPORTS.HAS_VALUE = function () {
    var defaultObjectValueFunc = function defaultObjectValueFunc(object, value) {
      return object === value;
    };

    var functionKeyObjectValueProc = function functionKeyObjectValueProc(functionKey) {
      return function (object, value) {
        return Boolean(functionKey(object, value));
      };
    };

    var selectKeyObjectValueProc = function selectKeyObjectValueProc(leftSelect, rightSelect) {
      var useLeftSelector = typeof leftSelect === "string" || typeof leftSelect === "number";
      var useRightSelector = leftSelect === rightSelect ? useLeftSelector : typeof rightSelect === "string" || typeof rightSelect === "number";
      return function (object, value) {
        if (useLeftSelector && !object.hasOwnProperty(leftSelect)) return false;
        if (useRightSelector && !value.hasOwnProperty(rightSelect)) return false;
        return (useLeftSelector ? GET(object, leftSelect) : object) === (useRightSelector ? GET(value, rightSelect) : value);
      };
    };

    return function (obj, value, key, getKey) {
      if (typeof key === "boolean") {
        if (typeof getKey !== "boolean") {
          getKey = key;
        }

        key = void 0;
      }

      if (obj === value) {
        return true;
      } else if (IS_OBJECT(obj)) {
        if (value === void 0 && key === void 0) return !IS_EMPTY(obj);
        var proc;

        if (key) {
          if (typeof key === "function") {
            proc = functionKeyObjectValueProc(key);
          } else if (IS_ARRAY(key) && key.length > 1) {
            proc = selectKeyObjectValueProc(key[0], key[1]);
          } else if (typeof key === "string" || typeof key === "number") {
            proc = selectKeyObjectValueProc(key, key);
          }
        } else {
          proc = defaultObjectValueFunc;
        }

        if (IS_ARRAY(obj)) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (proc(obj[i], value)) return getKey ? i : true;
          }
        } else {
          for (var objKey in obj) {
            if (obj.hasOwnProperty(objKey) && proc(obj[objKey], value)) return getKey ? objKey : true;
          }
        }
      }

      return getKey ? void 0 : false;
    };
  }();

  var GET = FUNCTION_EXPORTS.GET = function (target, path) {
    if (typeof target === "object") {
      switch (typeof path) {
        case "number":
          path += "";

        case "string":
          return path.indexOf("[") == 0 ? eval("target" + path) : eval("target." + path);

        case "function":
          return path.call(this, target);
      }
    } else if (typeof target === "function") {
      return target.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    return target;
  };

  var GET_KEY_BY = FUNCTION_EXPORTS.GET_KEY_BY = function (object, value) {
    if (IS_FUNCTION(value)) {
      if (IS_ARRAY(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (value(object[i], i) === true) return i;
      }
      if (IS_OBJECT(object)) for (var key in object) {
        if (value(object[key], key) === true) return key;
      }
    } else {
      if (IS_ARRAY(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (object[i] === value) return i;
      }
      if (IS_OBJECT(object)) for (var key in object) {
        if (object[key] === value) return key;
      }
    }
  };

  var STRING_CAST = FUNCTION_EXPORTS.STRING_CAST = function () {
    return function (text, defaultOrder, finder, at) {
      if (typeof text === "string" || typeof text === "number") {
        var idxs = [];
        var hist = [];
        var count = 0;
        var pin = !at || !IS_NUMBER(at) || at < 0 ? 0 : at;
        var strlen = text.length;
        var order = defaultOrder;
        var next;

        if (typeof finder !== "function") {
          finder = void 0;
        }

        do {
          var start = void 0;
          var size = void 0;

          if (typeof order === "string") {
            var findedIndex = text.indexOf(order, pin);

            if (findedIndex !== -1) {
              start = findedIndex;
              size = order.length;
            }
          } else if (order instanceof RegExp) {
            var cs = text.substring(pin || 0);
            var ma = cs.match(order);

            if (ma) {
              start = cs.indexOf(ma) + (ma.length - 1);
              size = ma.length;
            }
          }

          count++;

          if (typeof start !== "undefined") {
            var string = text.substring(start, start + size);
            var struct = {
              string: string,
              start: start,
              size: size,
              end: start + size //before pin

            };

            if (pin < start) {
              var noneCastStruct = {
                string: text.substring(pin, start),
                start: pin,
                size: start - pin,
                end: start
              };
              finder && finder(false, noneCastStruct, hist, count);
            } //now pin


            pin = start + size; //order

            var nextOrder = finder && finder(true, struct, hist, count);

            if (IS_PATTERN(nextOrder)) {
              order = nextOrder;
            } else {
              order = defaultOrder;
            } //idx


            idxs.push(start);
            hist.push({
              string: string,
              start: start,
              size: size
            }); //to be countinue

            if (pin >= strlen) {
              next = false;
            } else {
              next = true;
            }
          } else {
            var _struct = {
              string: text.substring(pin, strlen),
              start: pin,
              size: start - pin,
              end: strlen
            };
            finder && finder(false, _struct, hist, count);
            next = false;
          }
        } while (count > 1000 ? false : next);

        return idxs;
      }
    };
  }();
  /*
    bow.findIndexes("hello world","l") [2,3,9]
    bow.findIndexes("hello world",/l/) [2,3,9]
    bow.findIndexes("hello world",/\s/) [5]
  */


  var FIND_INDEXES = FUNCTION_EXPORTS.FIND_INDEXES = function () {
    var __find_string = function __find_string(c, s, p) {
      return c.indexOf(s, p);
    };

    var __find_regexp = function __find_regexp(c, s, p) {
      var i = c.substring(p || 0).search(s);
      return i >= 0 ? i + (p || 0) : i;
    };

    return function (c, s, at) {
      if (typeof c === "string" || typeof c === "number") {
        var idxs = [],
            mvc = c + "",
            s = IS_PATTERN(s) ? s : s + "",
            at = !at || !IS_NUMBER(at) || at < 0 ? 0 : at,
            __find = s instanceof RegExp ? __find_regexp : __find_string,
            next;

        do {
          var i = __find(c, s, at);

          if (i > -1) {
            at = (s.length || 1) + i;
            idxs.push(i);
            next = true;
          } else {
            next = false;
          }
        } while (next);

        return idxs;
      }
    };
  }();

  var EACH_PROC = FUNCTION_EXPORTS.EACH_PROC = function (arr, proc) {
    if (arr.length > 1) {
      for (var i = 0, l = arr.length - 1; i < l; proc(arr[i], i, false), i++) {
        ;
      }

      proc(arr[arr.length - 1], arr.length - 1, true);
    } else if (arr.length == 1) {
      proc(arr[0], 0, true);
    }

    return arr;
  };

  var STATIC_FOR_EACH_PROC = FUNCTION_EXPORTS.STATIC_FOR_EACH_PROC = function (obj, proc) {
    if (typeof obj === "object") for (var i = 0, a = obj instanceof Array, al = a ? obj.length : NaN, keys = Object.keys(obj), l = keys.length; i < l; proc(obj[keys[i]], keys[i], i, l, al), i++) {
      ;
    }
    return obj;
  };

  var FREE = FUNCTION_EXPORTS.FREE = function (datum) {
    var dest = {};
    Object.keys(datum).forEach(function (key) {
      if (!/^\$/.test(key)) {
        dest[key] = (0, _cloneDeep2.default)(datum[key]);
      }
    });
    return dest;
  };

  var EACH = function EACH(value, proc) {
    return EACH_PROC(AS_ARRAY(value), proc);
  };

  var FOR_EACH = function FOR_EACH(value, proc) {
    return STATIC_FOR_EACH_PROC(value, proc);
  };

  var REDUCE = function REDUCE(value, proc, meta) {
    value = AS_ARRAY(value);
    return EACH_PROC(value, function (v, i, l) {
      meta = proc(meta, v, i, l);
    }), meta;
  }; //PINPONGPOOL TRANSFORM


  var REMOVE_VALUE = FUNCTION_EXPORTS.REMOVE_VALUE = function (obj, value) {
    var detect = true;
    var array = IS_ARRAY(obj);

    while (detect) {
      var key = GET_KEY_BY(obj, value);

      if (typeof key === "undefined") {
        detect = false;
      } else {
        if (array) {
          obj.splice(key, 1);
        } else {
          delete obj[key];
        }
      }
    }

    return obj;
  };

  var CLEAR_OF = FUNCTION_EXPORTS.CLEAR_OF = function (data, fillFn, sp) {
    if (data instanceof Array) {
      sp = Array.prototype.splice.call(data, 0, data.length);
    } else if (typeof data == "object") {
      sp = {};

      for (var key in data) {
        sp[key] = data[key];
        delete data[key];
      }
    }

    return fillFn && fillFn(data, sp), data;
  };

  var INSERT_OF = FUNCTION_EXPORTS.INSERT_OF = function (data, v, a) {
    IS_ARRAY(data) && data.splice(typeof a === "number" ? a : 0, 0, v);
    return data;
  };

  var MOVE_OF = FUNCTION_EXPORTS.MOVE_OF = function (data, oldIndex, newIndex) {
    if (oldIndex !== newIndex && IS_ARRAY(data) && typeof oldIndex === "number" && typeof newIndex === "number" && oldIndex >= 0 && oldIndex < data.length) {
      Array.prototype.splice.call(data, newIndex > data.length ? data.length : newIndex, 0, Array.prototype.splice.call(data, oldIndex, 1)[0]);
    }

    return data;
  };

  var CONCAT_OF = FUNCTION_EXPORTS.CONCAT_OF = function (data, appends) {
    var data = AS_ARRAY(data);
    return EACH(appends, function (value) {
      data.push(value);
    }), data;
  };

  var FILTER_OF = FUNCTION_EXPORTS.FILTER_OF = function (data, func, exitFn) {
    var data = AS_ARRAY(data);
    var exitCnt = 0;

    for (var i = 0, ri = 0, keys = Object.keys(data), l = keys.length; i < l; i++, ri++) {
      var key = keys[i];
      var value = data[key];
      var result = func(value, key);

      if (result == false) {
        var exit = Array.prototype.splice.call(data, i, 1);
        i--;
        l--;
        typeof exitFn === "function" && exitFn(value, ri, exitCnt++);
      }
    }

    return data;
  };

  var SORT_OF = FUNCTION_EXPORTS.SORT_OF = function (data, filter) {
    if (data.length == 0) {
      return data;
    }

    switch (filter) {
      case 'desc':
        filter = function filter(a, b) {
          return a > b;
        };

        break;

      case undefined:
      case 'asc':
      default:
        if (typeof filter !== "function") {
          filter = function filter(a, b) {
            return a < b;
          };
        }

        break;
    }

    var result = [data[0]];

    for (var i = 1, l = data.length; i < l; i++) {
      for (var ri = 0, rl = result.length; ri < rl; ri++) {
        if (filter(data[i], result[ri]) === true) {
          INSERT_OF(result, data[i], ri);
          break;
        }

        if (ri + 1 === result.length) {
          result.push(data[i]);
        }
      }
    }

    CLEAR_OF(data);

    for (var i = 0, l = result.length; i < l; data.push(result[i]), i++) {
      ;
    }

    return data;
  };

  var REBASE = FUNCTION_EXPORTS.REBASE = function (obj, ref) {
    var result = {};

    for (var key in obj) {
      if (key === ".*") {
        var refValue = obj[key];

        for (var i = 0, d = Object.keys(ref), l = d.length; i < l; i++) {
          var refKey = d[i];

          if (typeof refValue === "function") {
            result[refKey] = obj[key];
          } else {
            if (typeof refValue !== "object" && typeof refValue !== "object" || IS_NODE(refValue)) {
              result[refKey] = refValue;
            } else {
              result[refKey] = Object.assign(result[refKey], refValue);
            }
          }
        }
      } else if (key.indexOf(",") > -1) {
        EACH(key.split(","), function (deepKey) {
          deepKey = deepKey.trim();

          if (typeof obj[key] === "function") {
            result[deepKey] = obj[key];
          } else {
            if (!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object" || IS_NODE(obj[key])) {
              result[deepKey] = obj[key];
            } else {
              result[deepKey] = Object.assign(result[deepKey] || (IS_ARRAY(obj[key]) ? [] : {}), obj[key], obj[deepKey]);
            }
          }
        });
      } else {
        if (typeof obj[key] === "function") {
          result[key] = obj[key];
        } else {
          if (typeof result[key] !== "object" && typeof obj[key] !== "object" || IS_NODE(obj[key])) {
            result[key] = obj[key];
          } else {
            result[key] = Object.assign(result[key], obj[key]);
          }
        }
      }
    }

    return result;
  }; //PINPONGPOOL FORMAT


  var RANGE = FUNCTION_EXPORTS.RANGE = function (value, step, sizeBase) {
    var r = [],
        start,
        end,
        reverse;

    if (typeof value === "number") {
      end = value;
      start = 0;
    } else if (typeof value === "object") {
      start = value[0];
      end = value[1];

      if (!step && typeof value[2] === "number") {
        step = value[2];
      }

      if (typeof sizeBase !== "boolean") {
        sizeBase = false;
      }
    }

    if (typeof start !== "number" || typeof end !== "number") {
      if (typeof start !== "number" && typeof end !== "number") return r;
      if (typeof start === "number") return r.push(start), r;
      if (typeof end === "number") return r.push(end), r;
    }

    if (start > end) {
      reverse = end;
      end = start;
      start = reverse;
      reverse = true;
    }

    end = parseFloat(end), end = isNaN(end) ? 0 : end;
    start = parseFloat(start), start = isNaN(start) ? 0 : start;
    step = parseFloat(step), step = isNaN(step) || step == 0 ? 1 : step;

    if (step <= 0) {
      return console.warn("range::not support minus step"), r;
    }

    ;

    if (sizeBase == false) {
      for (var i = start, l = end; i <= l; i = i + step) {
        r.push(i);
      }
    } else {
      for (var i = start, l = end; i < l; i = i + step) {
        r.push(i);
      }
    }

    return reverse ? r.reverse() : r;
  };

  var DOMAIN_RANGE_VALUE = FUNCTION_EXPORTS.DOMAIN_RANGE_VALUE = function (domain, range, vs, nice) {
    /*
    return forMap(cloneDeep(vs),function(v,sel){
      var $range  = sel ? range[sel]  : range;
      var $domain = sel ? domain[sel] : domain;
      if(!$range || !$domain){ return v; }
                      
      var dSize = $domain[1] - $domain[0];
      var sSize = $range[1] - $range[0];
      var dRate = (v - $domain[0]) / dSize;
      var calc  = $range[0] + sSize * dRate;
                      
      return nice ? Math.floor(calc) : calc;
    });
    */
  }; //matrixRange([1],[3]) // [[1], [2], [3]] 
  //matrixRange([1,1],[3,3]) // [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]


  var MATRIX_RANGE = FUNCTION_EXPORTS.DOMAIN_RANGE_VALUE = function (start, end, step, sizeBase) {
    /*
    var scales=[];
    var maxLength = max([start.length,end.length]);
    
    var selectLengthes = times(maxLength,function(scaleIndex){
        var range = NT.range([start[scaleIndex],end[scaleIndex]],step,sizeBase)
        scales.push(range);
        return range.length;
    });
     var result = times(reduce(selectLengthes,function(redu,value){
        return redu * value;
    },1),function(){ return new Array(maxLength); });
    
    var turnSize = 1;
    
    each(scales,function(scaleCase,scaleIndex){
        var scaleCaseLength = scaleCase.length;
        times(result.length,function(time){
            result[time][scaleIndex] = scaleCase[NT.turn(time,scaleCaseLength,turnSize)];
        });
        turnSize = turnSize * scaleCaseLength;
    });
    
    return result;
    */
  }; //TODO: Union HAS_VALUE


  var NESTED_HAS_PROC = FUNCTION_EXPORTS.NESTED_HAS_PROC = function (obj, key) {
    var keys = key.split(".");
    if (!keys.length) return false;
    var pointer = obj;

    for (var ki in keys) {
      var k = keys[ki];

      if (!pointer.hasOwnProperty(k)) {
        return false;
      } else {
        pointer = pointer[k];
      }
    }

    return true;
  };

  var APART = FUNCTION_EXPORTS.APART = function (text, split, block, blockEnd) {
    if (typeof text !== "string") return [text];
    var result = text.split(split === true ? /\s+/ : split || /\s+/);

    if (IS_PATTERN(block)) {
      if (!IS_PATTERN(blockEnd)) {
        blockEnd = block;
      }

      var aparts = [];
      var buffer = {
        dept: 0,
        parts: []
      };

      for (var d = result, i = 0, l = d.length; i < l; i++) {
        var part = d[i];
        var greb = {
          start: FIND_INDEXES(part, block),
          end: FIND_INDEXES(part, blockEnd)
        };
        console.log("part, greb", part, greb);

        for (var _d = greb.start, _i = 0, _l = _d.length; _i < _l; ++_i) {
          var startIndex = _d[_i];
        }
      }

      return aparts;
    } else {
      return result;
    }
  };

  var DIFF_STRUCTURE = FUNCTION_EXPORTS.DIFF_STRUCTURE = function (before, after) {
    var afterKeys = Object.keys(after);
    var beforeKeys;
    var canDiff = false;

    if (IS_OBJECT(before)) {
      if (IS_ARRAY(before)) {
        beforeKeys = before;
      } else {
        beforeKeys = Object.keys(before);
        canDiff = true;
      }
    } else {
      beforeKeys = [];
    }

    var analysis = {
      after: after,
      before: before,
      keys: REDUCE(UNIQUE(afterKeys.concat(beforeKeys)), function (redu, key) {
        redu[key] = undefined;
        return redu;
      }, {}),
      match: [],
      missing: [],
      surplus: [],
      diff: [],
      pass: false
    }; //match, missing

    for (var ki in beforeKeys) {
      if (!beforeKeys.hasOwnProperty(ki)) continue;
      var key = beforeKeys[ki];

      if (NESTED_HAS_PROC(after, key)) {
        analysis.match.push(key);
        analysis.keys[key] = "match";

        if (canDiff && !angular.equals(GET(after, key), GET(before, key))) {
          analysis.diff.push(key);
          analysis.keys[key] = "diff";
        }
      } else {
        analysis.surplus.push(key);
        analysis.keys[key] = "surplus";
      }
    } //surplus


    EACH(afterKeys, function (key) {
      if (!HAS_VALUE(analysis.match, key)) {
        analysis.missing.push(key);
        analysis.keys[key] = "missing";
      }
    }); //absolute

    analysis.pass = !analysis.missing.length && !analysis.surplus.length;
    return analysis;
  }; //PINPONGPOOL INTERFACE


  var TOGGLE = FUNCTION_EXPORTS.TOGGLE = function (ta, cv, set) {
    var index = -1;

    for (var d = AS_ARRAY(ta), _l2 = d.length, _i2 = 0; _i2 < _l2; _i2++) {
      if (d[_i2] == cv) {
        index = _i2 + 1;
        break;
      }
    }

    if (arguments.length > 2) for (var i = 0, l = ta.length; i < l; i++) {
      if (ta[i] == set) return ta[i];
    }
    index = ta.length == index ? 0 : index;
    return ta[index];
  };

  var TRUN = FUNCTION_EXPORTS.TRUN = function (i, p, ts) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = p - (abs > p ? abs % p : abs);
    }

    ;
    ts = ts ? ts : 1;
    i = Math.floor(i / ts);
    return p > i ? i : i % p;
  }; //PINPONGPOOL GENERATOR


  var RAND64 = FUNCTION_EXPORTS.RAND64 = function () {
    var rand64Token = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return function (length, codeAt, codeLength) {
      length = isNaN(length) ? 1 : parseInt(length);
      codeAt = isNaN(codeAt) ? 0 : parseInt(codeAt);
      codeLength = isNaN(codeLength) ? 62 - codeAt : parseInt(codeLength);
      var result = "";

      for (var i = 0, l = length; i < l; i++) {
        result = result + rand64Token.charAt(codeAt + parseInt(Math.random() * codeLength));
      }

      return result;
    };
  }();

  var TOKENIZE = FUNCTION_EXPORTS.TOKENIZE = function (seed, digits) {
    return Math.floor(Math.abs(Math.sin(Number((seed + "").replace(/./g, function (s, i) {
      return s.charCodeAt(0);
    }))) * 16777215) % 16777215).toString(digits || 16);
  };

  var FINALLY_EXPORTS = Object.keys(FUNCTION_EXPORTS).reduce(function (dest, key) {
    var camelKey = key.toLowerCase().replace(/\_[\w]/g, function (s) {
      return s.substr(1).toUpperCase();
    });
    dest[camelKey] = FUNCTION_EXPORTS[key];
    return dest;
  }, {});
  module.exports = _objectSpread({}, FINALLY_EXPORTS);
});