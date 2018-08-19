(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.pado = factory());
}(this, (function () { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var isAbsoluteNaN = function isAbsoluteNaN(it) {
    // eslint-disable-next-line no-self-compare
    return it !== it && typeof it === "number";
  };
  var isNone = function isNone(data) {
    return isAbsoluteNaN(data) || data === undefined || data === null;
  };
  var isNumber = function isNumber(it) {
    return typeof it === "number" && !isAbsoluteNaN(it);
  };
  var isInfinity = function isInfinity(it) {
    return it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY;
  };
  var isInteger = function isInteger(value) {
    //NaN, null, undefined
    if (isNone(value) === true) return false;

    if (typeof value === "string") {
      value = value.trim();
    }

    if (!/string|number/.test(typeof value) || isInfinity(value) || isNaN(value)) {
      return false;
    }

    return value == parseInt(value, 10);
  };
  var isArray = function isArray(data) {
    return Array.isArray(data) || data instanceof Array;
  };
  var isObject = function isObject(it) {
    return !!(it !== null && typeof it === "object");
  };
  var isFunction = function isFunction(it) {
    return typeof it === "function";
  };
  /*
    * likeObject is have hasOwnProperty
  */

  var likeObject = function likeObject(it) {
    return isObject(it) || isFunction(it);
  };
  var likeString = function likeString(data) {
    if (typeof data === "string") return true;
    if (isNumber(data)) return true;
    return false;
  };
  var likeNumber = function likeNumber(data) {
    if (isNumber(data) || isInfinity(data)) return true;
    if (typeof data === "string") return String(parseFloat(data)) === String(data);
    return false;
  };
  var likeArray = function likeArray(item) {
    return Array.isArray(item) || item !== null && typeof item === "object" && item.hasOwnProperty("length") && typeof item.length === "number" && item.length > 0;
  };
  var isPlainObject = function isPlainObject(data) {
    return typeof data === "object" && data.constructor === Object;
  };
  var isEnumerableObject = function isEnumerableObject(data) {
    return isPlainObject(data) || isArray(data);
  };
  var isNode = function isNode(a) {
    return isObject(a) && typeof a.nodeType === "number";
  };
  var isEmpty = function isEmpty(it) {
    if (typeof it === "undefined") return true;
    if (typeof it === "string") return it.trim().length < 1;

    if (typeof it === "object") {
      if (it == null) return true;
      if (it instanceof RegExp) return false;

      if (isArray(it)) {
        return !it.length;
      } else {
        for (var prop in it) {
          return false;
        }

        return true;
      }
    }

    if (typeof it === "number") {
      //NaN check 
      return isAbsoluteNaN(it) || false;
    }

    if (typeof it === "function") return false;
    if (typeof it === "boolean") return false;
    return true;
  }; // check JSON, input.value possible value

  var isPresence = function isPresence(it) {
    return !(it === undefined || isAbsoluteNaN(it));
  };
  var likeRegexp = function likeRegexp(s) {
    return typeof s === "string" || s instanceof RegExp;
  }; // none(undfinec, null, NaN), value(1,"1"), hash({}), array([]), node, object(new, Date), function, boolean

  var eqof = function eqof(it) {
    var typeIt = typeof it;

    switch (typeIt) {
      case "number":
        if (isAbsoluteNaN(it)) return "none";

      case "string":
        return "value";
        break;

      case "object":
        if (isNone(it)) return "none";
        if (likeArray(it)) return "array";
        if (isNode(it)) return "node";
        if (!isPlainObject(it)) return "object";
        return "hash";
        break;

      case "undefined":
        return "none";
        break;

      case "function":
      case "boolean":
      default:
        return typeIt;
        break;
    }
  };

  var baseEq = function baseEq(value, other, filter, depth, strict) {
    if (depth === void 0) {
      depth = 0;
    }

    if (arguments.length < 2) return false;
    var valueType = eqof(value);
    var otherType = eqof(other);
    if (valueType !== otherType) return false;

    switch (valueType) {
      case "none":
        return true;

      case "array":
        if (value.length !== other.length) {
          return false;
        }

        return value.every(function (vValue, i) {
          var oValue = other[i];
          return typeof filter === "function" && filter(i, [vValue, oValue], depth) === false ? true : baseEq(vValue, oValue, filter, depth + 1, strict);
        });
        break;

      case "hash":
        var vKeys = Object.keys(value);
        var oKeys = Object.keys(other);
        if (vKeys.length !== oKeys.length || !baseEq(vKeys.sort(), oKeys.sort())) return false;
        return vKeys.every(function (key) {
          var vValue = value[key];
          var oValue = other[key];
          return typeof filter === "function" && filter(key, [vValue, oValue], depth) === false ? true : baseEq(vValue, oValue, filter, depth + 1, strict);
        });
        break;

      case "node":
      case "object":
      case "function":
      case "boolean":
      case "value":
      default:
        return strict ? value === other : value == other;
    }
  };

  var isEqual = function isEqual(value, other, filter, depth) {
    return baseEq(value, other, filter, depth, true);
  };
  var likeEqual = function likeEqual(value, other, filter, depth) {
    return baseEq(value, other, function (key, values, depth) {
      return /^(\$|\_)/.test(key) ? false : typeof filter === "function" ? filter(key, values, depth) : true;
    }, depth, true);
  };
  var eqeq = function eqeq(value, other, filter, depth) {
    return baseEq(value, other, filter, depth, false);
  };
  var isExsist = function isExsist(value) {
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
  var notExsist = function notExsist(value) {
    return !isExsist(value);
  };
  var likePromise = function likePromise(target) {
    return typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function";
  };

  var asArray = function asArray(data, defaultArray) {
    if (defaultArray === void 0) {
      defaultArray = undefined;
    }

    if (isArray(data)) {
      return data;
    }

    if (isNone(data)) {
      return isArray(defaultArray) ? defaultArray : isNone(defaultArray) ? [] : [defaultArray];
    }

    if (typeof data === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }

    return [data];
  };
  var toArray = function toArray(data, option) {
    if (typeof data === "undefined" || data === null || isAbsoluteNaN(data)) return [];
    if (isArray(data)) return Array.prototype.slice.call(data);
    if (typeof data === "object" && typeof data.toArray === "function") return data.toArray();
    if (typeof data === "string" && typeof option === "string") return data.split(option);
    return [data];
  };
  var asObject = function asObject(data, defaultKey) {
    if (defaultKey === void 0) {
      defaultKey = "default";
    }

    if (isPlainObject(data)) {
      return data;
    } else {
      var _ref;

      return _ref = {}, _ref[defaultKey] = data, _ref;
    }
  };
  var toNumber = function toNumber(v, d) {
    switch (typeof v) {
      case "number":
        return v;

      case "string":
        var vr = v.replace(/[^.\d\-]/g, "") * 1;
        return isAbsoluteNaN(vr) ? 0 : vr;
        break;
    }

    switch (typeof d) {
      case "number":
        return d;

      case "string":
        var dr = d * 1;
        return isAbsoluteNaN(dr) ? 0 : dr;
        break;
    }

    return 0;
  };
  var cleanObject = function cleanObject(data) {
    if (data instanceof Array) {
      Array.prototype.splice.call(data, 0, data.length);
    } else if (typeof data == "object") {
      Object.keys(data).forEach(function (key) {
        delete data[key];
      });
    }

    return data;
  };
  var clone = function clone(target) {
    switch (typeof target) {
      case "undefined":
      case "function":
      case "boolean":
      case "number":
      case "string":
        return target;
        break;

      case "object":
        if (target === null) return target;

        if (isArray(target)) {
          var _r = [];

          for (var i = 0, length = target.length; i < length; i++) {
            _r.push(target[i]);
          }

          return _r;
        }

        if (!isPlainObject(target)) {
          if (target instanceof Date) {
            var _r2 = new Date();

            _r2.setTime(target.getTime());

            return _r2;
          }

          return target;
        }

        var r = {};
        Object.keys(target).forEach(function (k) {
          if (target.hasOwnProperty(k)) r[k] = target[k];
        });
        return r;
        break;

      default:
        console.error("clone::copy failed : target => ", target);
        return target;
        break;
    }
  };
  var cloneDeep = function cloneDeep(target) {
    if (typeof target === "object") {
      var d;

      if (isArray(target)) {
        if (!isArray(d)) {
          d = [];
        }

        for (var i = 0, l = target.length; i < l; i++) {
          d.push(typeof target[i] === "object" && target[i] !== null ? clone(target[i]) : target[i]);
        }

        return d;
      } else {
        d = {};
        Object.keys(target).forEach(function (p) {
          typeof target[p] === "object" && target[p] !== null && d[p] ? clone(target[p], d[p]) : d[p] = target[p];
        });
        return d;
      }
    } else {
      return clone(target);
    }
  };
  var free = function free(datum) {
    var dest = {};
    Object.keys(datum).forEach(function (key) {
      if (!/^\$/.test(key)) {
        dest[key] = cloneDeep(datum[key]);
      }
    });
    return dest;
  };

  var getKeyWithValue = function getKeyWithValue(obj, value) {
    if (isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (obj[i] === value) return i;
      }
    }

    if (isObject(obj)) {
      for (var key in obj) {
        if (obj[key] === value) return key;
      }
    }

    return undefined;
  };

  var removeValue = function removeValue(obj, value) {
    var detect = true;
    var array = isArray(obj);

    while (detect) {
      var key = getKeyWithValue(obj, value);

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
  var instance = function instance(func, proto) {
    var ins;

    var DummyInstance = function DummyInstance(param) {
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
  var alloc = function alloc(init) {
    var fn = init();

    var rn = function rn() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return fn.apply(this, args);
    };

    rn['reset'] = function () {
      fn = init(rn, rn);
    };

    rn['$constructor'] = fn;
    return rn;
  }; // TODO

  /*
  const syncData = (function (){
    const ENTER_HOOK  = (newDatum)=>Object.assign({}, newDatum)
    const UPDATE_HOOK = (oldDatum, newDatum)=>Object.assign({}, oldDatum, newDatum)
    
    return function (oldData, newData, getId, options){
      if(!/string|function/.test(typeof getId)) throw new Error("syncData need getId")
    
      if(typeof getId === "string"){
        const getIdString = getId
        getId = e=>_.get(e, getIdString)
      }

      oldData = asArray(oldData)
      newData = asArray(newData)

      const result = []
      const hooks  = asObject(options, "afterEach")
      
      if(typeof hooks["enter"] !== "function"){
        hooks["enter"] = ENTER_HOOK
      }
      
      if(typeof hooks["update"] !== "function"){
        hooks["update"] = UPDATE_HOOK
      }
      
      const oldDataMap = _.map(oldData, e=>{
        return { id: getId(e), ref: e }
      })
      
      
      asArray(newData).forEach((newDatum, i)=>{
        const newId = getId(newDatum)
        
        let oldDatum = _.get(oldDataMap[_.findIndex(oldDataMap, e=>e.id === newId)], "ref")
        let genDatum
        let dirty = false
        // eslint-disable-next-line no-undef
        if(oldDatum){
          // change is not dirty, modify is dirty
          if(typeof oldDatum !== typeof newDatum){
            dirty = false
          } else { // same type
            const oldOwnKeys = Object.keys(oldDatum).filter(key=>!(key.indexOf("$") === 0))
            const newOwnKeys = Object.keys(newDatum).filter(key=>!(key.indexOf("$") === 0))

            // inspect key chnage
            if(_.isEqual(oldOwnKeys, newOwnKeys)){
              dirty = !_.isEqual(_.pick(oldDatum, oldOwnKeys), _.pick(newDatum, newOwnKeys))
            } else {
              dirty = true
            }
          }
          
          if(typeof hooks["beforeUpdate"] === "function"){
            if(hooks["beforeUpdate"](oldDatum, newDatum) === false){
              return
            }
          }
          
          genDatum = hooks["update"](oldDatum, newDatum)
          
          if(typeof hooks["afterUpdate"] === "function"){
            genDatum = hooks["afterUpdate"](genDatum, oldDatum, newDatum)
          }
        } else {
          if(typeof hooks["beforeEnter"] === "function"){
            if(hooks["beforeEnter"](newDatum) === false){
              return
            }
          }
          
          genDatum = hooks["enter"](newDatum)
          
          if(typeof hooks["afterEnter"] === "function"){
            genDatum = hooks["afterEnter"](genDatum, newDatum)
          }
        }

        if(typeof hooks["afterEach"] === "function"){
          hooks["afterEach"](genDatum, i, dirty)
        }

        result.push(genDatum)
      })

      return result
    }
  }())
  */

  var keys = function keys(target, filterExp, strict) {
    var result = [];
    if (!likeObject(target)) return result;
    var filter = typeof filterExp === "function" ? filterExp : function () {
      return true;
    };
    (strict === true ? isArray(target) : likeArray(target)) && Object.keys(target).filter(function (key) {
      if (isNaN(key)) return;
      var numberKey = parseInt(key, 10);
      filter(numberKey, target) && result.push(parseInt(numberKey, 10));
    }) || (strict === true ? isPlainObject(target) : likeObject(target)) && Object.keys(target).forEach(function (key) {
      filter(key, target) && result.push(key);
    });
    return result;
  };
  var entries = function entries(it) {
    var result = [];

    switch (typeof it) {
      case "object":
        // eslint-disable-next-line no-unused-expressions
        isNone(it) ? 0 : likeArray(it) ? asArray(it).forEach(function (v, k) {
          result.push([k, v]);
        }) : Object.keys(it).forEach(function (key) {
          result.push([key, it[key]]);
        });
        break;
    }

    return result;
  };
  var deepKeys = function () {
    var nestedDeepKeys = function nestedDeepKeys(target, filter, scope, total) {
      if (typeof target === "object") {
        keys(target, function (key, target) {
          var child = target[key];
          var useKey = filter(child, key, scope.length);

          if (!useKey) {
            return;
          }

          var currentScope = clone(scope);
          currentScope.push(key);
          total.push(currentScope);
          nestedDeepKeys(child, filter, currentScope, total);
        }, true);
      }
    };

    return function (target, filter) {
      var result = [];
      nestedDeepKeys(target, filter ? function (child, key) {
        filter(child, key);
      } : function () {
        return true;
      }, [], result);
      return result;
    };
  }(); //remark.spec.js

  var matchString = function matchString(it, search, at) {
    if (at === void 0) {
      at = 0;
    }

    if (typeof it !== "string") throw new Error("matchString :: worng argument " + it);
    if (typeof search === "string") search = search.replace(new RegExp("(\\.|\\[|\\])", "g"), function (s) {
      return "\\" + s;
    });
    var result = it.substr(at).match(search);
    return result ? [result.index + at, result[0].length] : [-1, 0];
  };
  var findIndex = function () {
    var __find_string = function __find_string(it, search, at) {
      return it.indexOf(search, at);
    };

    var __find_regexp = function __find_regexp(it, search, at) {
      var i = it.substring(at || 0).search(search);
      return i >= 0 ? i + (at || 0) : i;
    };

    return function (it, search, at) {
      return (search instanceof RegExp ? __find_regexp : __find_string)(it, search, at);
    };
  }(); //remark.spec.js

  var findIndexes = function () {
    return function (c, s, at) {
      if (typeof c === "string" || typeof c === "number") {
        var idxs = [];
        var s = likeRegexp(s) ? s : s + "";
        var at = !at || !isNumber(at) || at < 0 ? 0 : at;
        var next;

        do {
          var i = findIndex(c, s, at);

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

  var all = function all(data, fn) {
    data = asArray(data);

    if (data.length === 0) {
      return false;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      if (!fn(data[i], i)) {
        return false;
      }
    }
    return true;
  };
  var deep = function deep(data) {};
  var times = function times(length, fn) {
    var result = [];

    for (var i = 0, l = length; i < l; i++) {
      result.push(fn(i));
    }

    return result;
  };
  var hashMap = function hashMap(object, fn) {
    if (typeof object === "object" && !isArray(object)) for (var k in object) {
      object[k] = fn(object[k], k);
    } else return fn(object, void 0);
    return object;
  };

  var readString = function () {
    var rebaseMatches = function rebaseMatches(matches) {
      return entries(asArray(matches));
    };

    return function (text, matches, castFn, props) {
      var payload = {
        content: text,
        props: props
      };
      var newMatchEntries = rebaseMatches(matches);
      var castingState = {
        firstIndex: 0,
        lastIndex: text.length,
        castingStart: 0,
        cursor: 0
      };

      if (typeof props === "object" && isNumber(props.start)) {
        castingState.castingStart = props.start;
        castingState.cursor = props.start;
      }

      var open = function open(_ref) {
        var _ref$castingState = _ref.castingState,
            firstIndex = _ref$castingState.firstIndex,
            lastIndex = _ref$castingState.lastIndex,
            castingStart = _ref$castingState.castingStart,
            cursor = _ref$castingState.cursor,
            matchEntries = _ref.matchEntries,
            castFn = _ref.castFn,
            parentScope = _ref.parentScope;

        if (cursor >= lastIndex) {
          return false;
        } //find match


        var matchesMap = matchEntries.map(function (_ref2) {
          var matchType = _ref2[0],
              matchExp = _ref2[1];
          return [matchString(text, matchExp, cursor), matchType, matchExp];
        });
        var firstMatch = asArray(matchesMap).sort(function (_ref3, _ref4) {
          var a = _ref3[0],
              aPriority = _ref3[1];
          var b = _ref4[0],
              bPriority = _ref4[1];
          return a[0] < 0 ? true : b[0] < 0 ? false : a[0] == b[0] ? aPriority < bPriority : a[0] > b[0];
        })[0]; // top match is not exsist

        if (!firstMatch) {
          return false;
        } // unmatched


        if (firstMatch[0][0] === -1) {
          firstMatch = [[-1, 0], -1, null];
        } //next variant


        var _firstMatch = firstMatch,
            _firstMatch$ = _firstMatch[0],
            matchIndex = _firstMatch$[0],
            matchSize = _firstMatch$[1],
            matchType = _firstMatch[1],
            matchExp = _firstMatch[2];
        var castStart = castingStart;
        var castEnd = matchType === -1 ? lastIndex : matchIndex + matchSize;
        var castSize = castEnd - castStart;
        var skipSize = castSize - matchSize; //next params

        var matching = {
          matchType: matchType,
          matchExp: matchExp,
          matchIndex: matchIndex,
          matchSize: matchSize,
          skipSize: skipSize
        };
        var casting = {
          firstIndex: firstIndex,
          lastIndex: lastIndex,
          castStart: castStart,
          castEnd: castEnd,
          castSize: castSize
        };
        var scope = {
          fork: function fork(matchEntries, castFn) {
            var newMatchEntries = rebaseMatches(matches);
            open({
              castingState: {
                firstIndex: matching.matchIndex,
                lastIndex: matching.matchIndex + matchSize,
                castingStart: matching.matchIndex,
                cursor: matching.matchIndex
              },
              matchEntries: newMatchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          },
          next: function next(needCursor) {
            var cursorTo = isNumber(needCursor) ? needCursor : casting.castEnd;
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: cursorTo,
                cursor: cursorTo
              },
              matchEntries: matchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          },
          enter: function enter(enterMatches, enterCastFn) {
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: matching.matchIndex,
                cursor: matching.matchIndex
              },
              matchEntries: rebaseMatches(enterMatches),
              castFn: enterCastFn,
              parentScope: {
                next: scope.next
              }
            });
          },
          exit: function exit(needCursor) {
            parentScope && parentScope.next(isNumber(needCursor) ? needCursor : casting.castEnd);
          },
          more: function more() {
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: castStart,
                cursor: casting.castEnd
              },
              matchEntries: matchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          }
        };
        castFn(_objectSpread({}, payload, matching, casting, scope));
        return true;
      };

      open({
        castingState: castingState,
        matchEntries: newMatchEntries,
        castFn: castFn
      });
      return payload;
    };
  }();
  var readPath = function () {
    var __filterDotPath = function __filterDotPath(dotPath, removeFirstDot) {
      return removeFirstDot && dotPath.indexOf(".") === 0 ? dotPath.substr(1) : dotPath;
    };

    var __filterBlockPath = function __filterBlockPath(blockPath) {
      //remove []
      blockPath = blockPath.substring(1, blockPath.length - 1); //interger

      if (/^[0-9]+$/.test(blockPath)) {
        return parseInt(blockPath, 10);
      } //remove ''


      if (/^\'.*\'$/.test(blockPath) || /^\".*\"$/.test(blockPath)) {
        blockPath = blockPath.substring(1, blockPath.length - 1);
      }

      return blockPath;
    };

    return function (pathParam) {
      if (isArray(pathParam)) {
        return pathParam;
      }

      if (likeString(pathParam)) {
        if (isNumber(pathParam)) {
          return [pathParam];
        }

        if (typeof pathParam === "string") {
          //one depth
          if (!/\.|\[/.test(pathParam)) {
            return [pathParam];
          } //multiple depth


          var _readString = readString(pathParam, [".", "["], function (_ref5) {
            var content = _ref5.content,
                path = _ref5.props.path,
                matchExp = _ref5.matchExp,
                castStart = _ref5.castStart,
                castEnd = _ref5.castEnd,
                castSize = _ref5.castSize,
                skipSize = _ref5.skipSize,
                enter = _ref5.enter,
                next = _ref5.next;

            if (matchExp === ".") {
              skipSize && path.push(content.substr(castStart, skipSize));
              next();
            }

            if (matchExp === "[") {
              var stackCount = 0;

              if (skipSize) {
                path.push(__filterDotPath(content.substr(castStart, skipSize), castStart !== 0));
              }

              enter(["[", "]"], function (_ref6) {
                var matchExp = _ref6.matchExp,
                    castStart = _ref6.castStart,
                    castEnd = _ref6.castEnd,
                    more = _ref6.more,
                    exit = _ref6.exit;
                if (matchExp === "[") stackCount++;
                if (matchExp === "]") stackCount--;
                if (matchExp === null) return;

                if (stackCount === 0) {
                  path.push(__filterBlockPath(content.substring(castStart, castEnd)));
                  exit();
                } else {
                  more();
                }
              });
            }

            if (matchExp === null) {
              path.push(__filterDotPath(content.substr(castStart, castEnd), castStart !== 0));
            }
          }, {
            path: []
          }),
              result = _readString.props.path;

          return result;
        }
      }

      return [];
    };
  }();
  var get = function get(target, path, defaultValue) {
    if (typeof target === "object") {
      switch (typeof path) {
        case "number":
          path += "";

        case "string":
          path = readPath(path);

        case "object":
          if (isArray(path)) {
            var allget = all(path, function (name) {
              if (likeObject(target) && (target.hasOwnProperty(name) || target[name])) {
                target = target[name];
                return true;
              } else {
                return false;
              }
            });
            return allget ? target : defaultValue;
          } else {
            return;
          }

          break;

        case "function":
          return path.call(this, target);
      }
    } else if (typeof target === "function") {
      return target.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    return target;
  };
  var hasProperty = function hasProperty(target, pathParam) {
    return all(readPath(pathParam), function (path) {
      if (likeObject(target) && likeString(path) && target.hasOwnProperty(path)) {
        target = target[path];
        return true;
      }

      return false;
    });
  };
  var hasValue = function () {
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
        return (useLeftSelector ? get(object, leftSelect) : object) === (useRightSelector ? get(value, rightSelect) : value);
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
      } else if (likeObject(obj)) {
        if (value === void 0 && key === void 0) return !isEmpty(obj);
        var proc;

        if (key) {
          if (typeof key === "function") {
            proc = functionKeyObjectValueProc(key);
          } else if (isArray(key) && key.length > 1) {
            proc = selectKeyObjectValueProc(key[0], key[1]);
          } else if (typeof key === "string" || typeof key === "number") {
            proc = selectKeyObjectValueProc(key, key);
          }
        } else {
          proc = defaultObjectValueFunc;
        }

        if (isArray(obj)) {
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

  var unique = function unique(array, findKey) {
    var result = [];
    var uniqueSet = new Set();

    if (typeof findKey === "undefined") {
      findKey = function findKey(v) {
        return v;
      };
    }

    if (typeof findKey === "string") {
      var keyPath = findKey;

      findKey = function findKey(v) {
        return v[keyPath];
      };
    }

    array.forEach(function (v) {
      var key = findKey(v);
      if (uniqueSet.has(key)) return;
      uniqueSet.add(key);
      result.push(v);
    });
    return result;
  };
  var getKeyBy = function getKeyBy(object, value) {
    if (isFunction(value)) {
      if (isArray(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (value(object[i], i) === true) return i;
      }
      if (isObject(object)) for (var key in object) {
        if (value(object[key], key) === true) return key;
      }
    } else {
      if (isArray(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (object[i] === value) return i;
      }
      if (isObject(object)) for (var key in object) {
        if (object[key] === value) return key;
      }
    }
  };
  var clearOf = function clearOf(data, fillFn, sp) {
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
  var insertOf = function insertOf(data, v, a) {
    isArray(data) && data.splice(typeof a === "number" ? a : 0, 0, v);
    return data;
  };
  var moveOf = function moveOf(data, oldIndex, newIndex) {
    if (oldIndex !== newIndex && isArray(data) && typeof oldIndex === "number" && typeof newIndex === "number" && oldIndex >= 0 && oldIndex < data.length) {
      Array.prototype.splice.call(data, newIndex > data.length ? data.length : newIndex, 0, Array.prototype.splice.call(data, oldIndex, 1)[0]);
    }

    return data;
  };
  var concatOf = function concatOf(data, appends) {
    var data = asArray(data);
    return asArray(appends).forEach(function (value) {
      data.push(value);
    }), data;
  };
  var filterOf = function filterOf(data, func, exitFn) {
    var data = asArray(data);
    var exitCnt = 0;

    for (var i = 0, ri = 0, keys = Object.keys(data), l = keys.length; i < l; i++, ri++) {
      var key = keys[i];
      var value = data[key];
      var result = func(value, key);

      if (result == false) {
        /*
        var exit = Array.prototype.splice.call(data, i, 1)
        */
        i--;
        l--;
        typeof exitFn === "function" && exitFn(value, ri, exitCnt++);
      }
    }

    return data;
  };
  var sortOf = function sortOf(data, filter) {
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
          insertOf(result, data[i], ri);
          break;
        }

        if (ri + 1 === result.length) {
          result.push(data[i]);
        }
      }
    }

    clearOf(data);

    for (var i = 0, l = result.length; i < l; data.push(result[i]), i++) {
    }

    return data;
  };
  var rebase = function rebase(obj, ref) {
    var result = {};

    for (var key in obj) {
      if (key === ".*") {
        var refValue = obj[key];

        for (var i = 0, d = Object.keys(ref), l = d.length; i < l; i++) {
          var refKey = d[i];

          if (typeof refValue === "function") {
            result[refKey] = obj[key];
          } else {
            if (typeof refValue !== "object" && typeof refValue !== "object" || isNode(refValue)) {
              result[refKey] = refValue;
            } else {
              result[refKey] = Object.assign(result[refKey], refValue);
            }
          }
        }
      } else if (key.indexOf(",") > -1) {
        key.split(",").forEach(function (deepKey) {
          deepKey = deepKey.trim();

          if (typeof obj[key] === "function") {
            result[deepKey] = obj[key];
          } else {
            if (!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object" || isNode(obj[key])) {
              result[deepKey] = obj[key];
            } else {
              result[deepKey] = Object.assign(result[deepKey] || (isArray(obj[key]) ? [] : {}), obj[key], obj[deepKey]);
            }
          }
        });
      } else {
        if (typeof obj[key] === "function") {
          result[key] = obj[key];
        } else {
          if (typeof result[key] !== "object" && typeof obj[key] !== "object" || isNode(obj[key])) {
            result[key] = obj[key];
          } else {
            result[key] = Object.assign(result[key], obj[key]);
          }
        }
      }
    }

    return result;
  }; //TODO: Union hasValue

  var NESTED_HAS_PROC = function NESTED_HAS_PROC(obj, key) {
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

  var diffStructure = function diffStructure(before, after) {
    var afterKeys = Object.keys(after);
    var beforeKeys;
    var canDiff = false;

    if (isObject(before)) {
      if (isArray(before)) {
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
      keys: unique(afterKeys.concat(beforeKeys)).reduce(function (dest, key) {
        dest[key] = undefined;
        return dest;
      }, {}),
      match: [],
      missing: [],
      surplus: [],
      diff: [],
      pass: false //match, missing

    };

    for (var ki in beforeKeys) {
      if (!beforeKeys.hasOwnProperty(ki)) continue;
      var key = beforeKeys[ki];

      if (NESTED_HAS_PROC(after, key)) {
        analysis.match.push(key);
        analysis.keys[key] = "match";

        if (canDiff && !isEqual(get(after, key), get(before, key))) {
          analysis.diff.push(key);
          analysis.keys[key] = "diff";
        }
      } else {
        analysis.surplus.push(key);
        analysis.keys[key] = "surplus";
      }
    } //surplus


    asArray(afterKeys).forEach(function (key) {
      if (!hasValue(analysis.match, key)) {
        analysis.missing.push(key);
        analysis.keys[key] = "missing";
      }
    }); //absolute

    analysis.pass = !analysis.missing.length && !analysis.surplus.length;
    return analysis;
  };

  var fill = function fill(collection, fillLength, emptyDefault) {
    if (emptyDefault === void 0) {
      emptyDefault = undefined;
    }

    var data = asArray(collection);
    var dataLength = data.length;
    fillLength = isNumber(fillLength) ? fillLength : 0;
    var fillFn = typeof emptyDefault !== "function" ? function () {
      return emptyDefault;
    } : emptyDefault;

    for (var i = 0, l = fillLength - dataLength; i < l; data.push(fillFn(dataLength++, i++))) {
    }

    return collection;
  };

  var baseCut = function baseCut(collection, cutLength, emptyDefault, useFill) {
    var data = asArray(collection);
    var rest;
    cutLength = isNumber(cutLength) ? cutLength : 1;

    if (data.length > cutLength) {
      rest = data.splice(cutLength, Number.POSITIVE_INFINITY);
      return [data, rest];
    }

    useFill === true && (data = fill(data, cutLength, emptyDefault));
    return [data, []];
  };

  var cut = function cut(collection, cutLength, fillContent) {
    var useFill = arguments.length > 2;
    return baseCut(collection, cutLength, fillContent, useFill)[0];
  };
  var cuts = function cuts(collection, cutLength, fillContent) {
    var result = [];
    var rest = collection;
    var rowIndex = 0;
    var enumFn = typeof fillContent !== "function" ? function () {
      return fillContent;
    } : function (index) {
      return fillContent(rowIndex * cutLength + index, index, rowIndex);
    };
    var useFill = arguments.length > 2;

    do {
      var _baseCut = baseCut(rest, cutLength, enumFn, useFill);

      collection = _baseCut[0];
      rest = _baseCut[1];
      result.push(collection);
      rowIndex++;
    } while (rest.length > 0);

    return result;
  }; //reduce.spec.js

  var top = function top(data, iteratee, topLength) {
    switch (typeof iteratee) {
      case "function":
        //iteratee=iteratee;
        break;

      case "string":
        var path = iteratee;

        iteratee = function iteratee(a, b) {
          return get(a, path) < get(b, path);
        };

        break;

      case "boolean":
        iteratee = iteratee ? function (a, b) {
          return a < b;
        } : function (a, b) {
          return a > b;
        };
        break;

      default:
        iteratee = function iteratee(a, b) {
          return a < b;
        };

        break;
    }

    if (typeof topLength === "boolean") {
      topLength = topLength ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }

    return isNumber(topLength) || isInfinity(topLength) ? asArray(data).sort(function (a, b) {
      return iteratee(a, b);
    }).splice(0, topLength) : asArray(data).sort(function (a, b) {
      return iteratee(a, b);
    })[0];
  };

  var limitNumber = function () {
    var limitOf = function limitOf(number, max, min) {
      if (typeof number == "number") {
        if (isAbsoluteNaN(number) || number === Infinity) {
          return min;
        }

        if (isNumber(min) && number < min) {
          return min;
        }

        if (isNumber(max) && number > max) {
          return max;
        }
      }

      return number;
    };

    var limitNumber = function limitNumber(numbers, max, min) {
      if (typeof max !== "number") {
        max = Number.POSITIVE_INFINITY;
      }

      if (typeof min !== "number") {
        if (min === null || isAbsoluteNaN(min)) {
          min = Number.NEGATIVE_INFINITY;
        } else {
          min = 0;
        }
      }

      if (isArray(numbers)) {
        for (var d = numbers, i = 0, l = d.length; i < l; i++) {
          d[i] = limitOf(d[i], max, min);
        }

        return numbers;
      } else {
        return limitOf(numbers, max, min);
      }
    };

    return limitNumber;
  }();
  var accurateTimeout = function (originalTimeout) {
    return function (trigger, time, resolutionRatio, coverage) {
      if (time === void 0) {
        time = 0;
      }

      if (resolutionRatio === void 0) {
        resolutionRatio = 0.75;
      }

      if (coverage === void 0) {
        coverage = 25;
      }

      var destTime = Date.now() + time;

      if (!isNumber(time)) {
        time = 0;
      }

      if (!isNumber(resolutionRatio)) {
        resolutionRatio = 0.75;
      }

      if (!isNumber(coverage)) {
        resolutionRatio = 25;
      }

      if (resolutionRatio > 1) {
        resolutionRatio = 1;
      }

      if (resolutionRatio < 0.1) {
        resolutionRatio = 0.1;
      }

      if (coverage < 5) {
        coverage = 5;
      }

      function preparation(restTime) {
        var preparaTime = Math.floor(restTime * resolutionRatio);
        originalTimeout(execution, preparaTime);
      }

      function execution() {
        var restTime = destTime - Date.now();

        if (restTime < coverage) {
          if (restTime < 1) {
            originalTimeout(trigger, 0);
          } else {
            originalTimeout(trigger, restTime);
          }
        } else {
          preparation(restTime);
        }
      }

      execution();
    };
  }(setTimeout);
  var turn = function turn(i, limit, ts, resultHook) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = limit - (abs > limit ? abs % limit : abs);
    }

    ts = typeof ts === "number" ? ts : 1;
    var fixIndex = Math.floor(i / ts);
    var result = limit > fixIndex ? fixIndex : fixIndex % limit;
    return typeof resultHook === "function" ? resultHook(result, i, limit, ts) : result;
  };
  var turnTime = function turnTime(i, limit, ts) {
    return turn(i, limit, ts, function (result, i, limit, ts) {
      return [result, Math.floor(i / (limit * ts))];
    });
  };
  var toggle = function toggle(toggleArgs, currentValue, step) {
    if (step === void 0) {
      step = 1;
    }

    return (toggleArgs = asArray(toggleArgs)) && toggleArgs[(toggleArgs.findIndex(function (val) {
      return val === currentValue;
    }) + step) % toggleArgs.length];
  };

  var rangeModel = function rangeModel(value, step, sizeBase) {
    var start, end, reverse;

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
    /*
    if(typeof start !== "number" || typeof end !== "number"){
      if(typeof start !== "number" && typeof end !== "number") return r
      if(typeof start === "number") return r.push(start), r
      if(typeof end === "number") return r.push(end), r
    }
    */


    if (start > end) {
      reverse = end;
      end = start;
      start = reverse;
      reverse = true;
    }

    end = parseFloat(end);
    end = isAbsoluteNaN(end) ? 0 : end;
    start = parseFloat(start);
    start = isAbsoluteNaN(start) ? 0 : start;
    step = parseFloat(step);
    step = isAbsoluteNaN(step) || step == 0 ? 1 : step;
    return {
      start: start,
      end: end,
      step: step,
      reverse: reverse,
      sizeBase: sizeBase
    };
  };
  var range = function range(value, stepSize, sizeBaseRange) {
    var r = [];

    var _rangeModel = rangeModel(value, stepSize, sizeBaseRange),
        start = _rangeModel.start,
        end = _rangeModel.end,
        step = _rangeModel.step,
        reverse = _rangeModel.reverse,
        sizeBase = _rangeModel.sizeBase;

    if (step <= 0) {
      return console.warn("range::not support minus step"), r;
    }

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
  var domainRangeValue = function domainRangeValue(domain, range, vs, nice, limit) {
    return hashMap(cloneDeep(vs), function (v, sel) {
      var $range = sel ? range[sel] : range;
      var $domain = sel ? domain[sel] : domain;

      if (!$range || !$domain) {
        return v;
      }

      var dSize = $domain[1] - $domain[0];
      var sSize = $range[1] - $range[0];
      var dRate = (v - $domain[0]) / dSize;
      var calc = $range[0] + sSize * dRate;
      var result = nice ? Math.floor(calc) : calc;
      return limit ? $range[1] > $range[0] ? limitNumber(result, $range[1], $range[0]) : limitNumber(result, $range[0], $range[1]) : result;
    });
  };
  var domainRangeInterpolate = function domainRangeInterpolate(domain, range, nice, limit) {
    var _domain = domain;
    var _range = range;
    var _nice = nice;

    var interpolate = function interpolate(value) {
      return domainRangeValue(_domain, _range, value, _nice, limit);
    };

    interpolate.domain = function (domain) {
      _domain = domain;
      return interpolate;
    };

    interpolate.range = function (range) {
      _range = range;
      return interpolate;
    };

    interpolate.nice = function (nice) {
      _nice = nice;
      return interpolate;
    };

    return interpolate;
  }; //matrixRange([1],[3]) // [[1], [2], [3]] 
  //matrixRange([1,1],[3,3]) // [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]

  var matrixRange = function matrixRange(start, end, step, sizeBase) {
    var scales = [];
    var maxLength = top([start.length, end.length]);
    var selectLengthes = times(maxLength, function (scaleIndex) {
      var rangeResult = range([start[scaleIndex], end[scaleIndex]], step, sizeBase);
      scales.push(rangeResult);
      return rangeResult.length;
    });
    var result = times(selectLengthes.reduce(function (redu, value) {
      return redu * value;
    }, 1), function () {
      return new Array(maxLength);
    });
    var turnSize = 1;
    asArray(scales).forEach(function (scaleCase, scaleIndex) {
      var scaleCaseLength = scaleCase.length;
      times(result.length, function (time) {
        result[time][scaleIndex] = scaleCase[turn(time, scaleCaseLength, turnSize)];
      });
      turnSize = turnSize * scaleCaseLength;
    });
    return result;
  }; //validate matrix format

  var validMatrix = function validMatrix(arr) {
    // Matrix must be array
    if (!likeArray(arr)) {
      return false;
    } // Empty is valid


    if (arr.length === 0) {
      return true;
    } //find some error ( return true => false)


    return !Array.from(arr).some(function (v) {
      if (likeArray(v)) {
        //length check
        if (v.length !== arr.length) return true; //type check

        return v.some(function (likeError) {
          return !(likeError == undefined || isNumber(likeError));
        });
      }

      return true;
    });
  }; // real matrix model

  var asMatrix = function asMatrix(arr, columnSize) {
    var result = [];

    if (typeof columnSize === "number" && columnSize > 0) {
      var rowCount = Math.ceil(arr.length / columnSize);
      times(rowCount, function (i) {
        var column = [];
        times(columnSize, function (ci) {
          column.push(arr[i * columnSize + ci]);
        });
        result.push(column);
      });
    } else {
      return [arr];
    }

    return result;
  };
  var multiplyMatrix = function multiplyMatrix(aMatrix, bMatrix) {
    if (!validMatrix(aMatrix) && validMatrix(bMatrix)) {
      return null;
    }

    if (aMatrix[0].length !== bMatrix.length) {
      return null;
    }

    var result = [];
    times(bMatrix.length, function (rRowIndex) {
      var columnLength = bMatrix[rRowIndex].length;
      var columnResult = [];
      times(columnLength, function (rColumnIndex) {
        //var calcLog = [];
        var multiplied = aMatrix[rRowIndex].reduce(function (dist, num, index) {
          //calcLog.push(`${num} * ${bMatrix[index][rColumnIndex]}`)
          return num * bMatrix[index][rColumnIndex] + dist;
        }, 0); //console.log("calcLog",calcLog.join(" + "))

        columnResult.push(multiplied);
      });
      result.push(columnResult);
    });
    return result;
  };

  var rand64 = function () {
    var rand64Token = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return function (length, codeAt, codeLength) {
      length = isAbsoluteNaN(length) ? 1 : parseInt(length);
      codeAt = isAbsoluteNaN(codeAt) ? 0 : parseInt(codeAt);
      codeLength = isAbsoluteNaN(codeLength) ? 62 - codeAt : parseInt(codeLength);
      var result = "";

      for (var i = 0, l = length; i < l; i++) {
        result = result + rand64Token.charAt(codeAt + parseInt(Math.random() * codeLength));
      }

      return result;
    };
  }();
  var tokenize = function tokenize(seed, digits) {
    return Math.floor(Math.abs(Math.sin(Number((seed + "").replace(/./g, function (s, i) {
      return s.charCodeAt(0);
    }))) * 16777215) % 16777215).toString(digits || 16);
  };
  var randRange = function randRange(rangeValue, nice) {
    var _rangeModel = rangeModel(rangeValue),
        start = _rangeModel.start,
        end = _rangeModel.end;

    var result = start + Math.random() * (end - start);
    return nice === true ? Math.ceil(result) : result;
  };

  var dateExp = function dateExp(dv, format, pad) {
    if (isArray(dv)) dv = dv.join(' ');
    var dt = /(\d\d\d\d|)[^\d]?(\d\d|\d|).?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)/.exec(dv);
    dt[1] = dt[1] || new Date().getYear() + 1900 + '';
    dt[2] = dt[2] || new Date().getMonth() + 1;
    dt[3] = dt[3] || new Date().getDate();
    dt[4] = dt[4] || "00";
    dt[5] = dt[5] || "00";
    dt[6] = dt[6] || "00";
    var r = [dt[1], dt[2], dt[3], dt[4], dt[5], dt[6], dt[0]];
    Object.defineProperties(r, {
      year: {
        enumerable: false,
        value: dt[1]
      },
      month: {
        enumerable: false,
        value: dt[2]
      },
      date: {
        enumerable: false,
        value: dt[3]
      },
      hour: {
        enumerable: false,
        value: dt[4]
      },
      minute: {
        enumerable: false,
        value: dt[5]
      },
      second: {
        enumerable: false,
        value: dt[6]
      },
      init: {
        enumerable: false,
        value: dt[7]
      },
      format: {
        enumerable: false,
        get: function get() {
          return function (s) {
            return s.replace('YYYY', r.year).replace(/(MM|M)/, r.month).replace(/(DD|D)/, r.date).replace(/(hh|h)/, r.hour).replace(/(mm|m)/, r.minute).replace(/(ss|s)/, r.second).replace(/(A)/, toNumber(r.hour) > 12 ? 'PM' : 'AM');
          };
        }
      }
    });

    if (typeof format === 'string') {
      return r.format(format);
    }

    return r;
  };
  var timestampExp = function timestampExp(exp) {
    if (arguments.length === 0) {
      return +new Date();
    }

    if (typeof exp === "string") {
      exp = dateExp(exp);
    }

    if (typeof exp === "number") {
      return exp;
    }

    if (isArray(exp) && exp.length == 7) {
      exp = new Date(exp[0], exp[1], exp[2], exp[3], exp[4], exp[5]);
    }

    if (exp instanceof Date) {
      return +exp;
    }

    return 0;
  };
  var timescaleExp = function timescaleExp(exp) {
    var scale = 0;

    if (typeof exp === "number") {
      return exp;
    }

    if (typeof exp === "string") {
      // 
      exp = exp.replace(/\d+(Y|year)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 31536000000;
        });
        return "";
      });
      exp = exp.replace(/\d+(M|month)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 2678400000;
        });
        return "";
      });
      exp = exp.replace(/\d+(D|day)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 86400000;
        });
        return "";
      });
      exp = exp.replace(/\d+(h|hour)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 3600000;
        });
        return "";
      });
      exp = exp.replace(/\d+(ms|millisecond)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 1;
        });
        return "";
      });
      exp = exp.replace(/\d+(m|minute)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 60000;
        });
        return "";
      });
      exp = exp.replace(/\d+(s|second)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 1000;
        });
        return "";
      });
    }

    return scale;
  };

  var argumentNamesBy = function getArgs(fn) {
    if (typeof fn !== "function") return []; // normal -  function[^\(]*?\(([^)]*)\)
    // arrow  -  \([\)]*\)\s*\=\>\s*\{

    var args = fn.toString().match(/function[^\(]*?\(([^)]*)\)|\([\)]*\)\s*\=\>\s*\{/)[1];
    if (!args) return [];
    return args.split(',').map(function (s) {
      return s.trim();
    }).filter(function (n) {
      return n;
    });
  };
  var scopelizeBy = function scopelizeBy(evalCommand) {
    if (evalCommand.indexOf("return") == -1) {
      evalCommand = "  return " + evalCommand;
    }

    var command = evalCommand;

    var scopeBeforeFn = function scopeBeforeFn(scope, info) {
      var params = [];
      var fnArgs = [];
      Object.keys(scope).forEach(function (key) {
        params.push(scope[key]);
        fnArgs.push(key);
      });
      fnArgs.push(command);
      var makeFn = Function.apply(Function, fnArgs);

      if (typeof info === "function") {
        info({
          func: makeFn,
          args: fnArgs,
          params: params
        });
      }

      return makeFn.apply(void 0, params);
    };

    scopeBeforeFn.scoped = function () {
      return command;
    };

    return scopeBeforeFn;
  };

  /*
    usage
    const size = 20
    const stroke = 1

    const { x, y, radius, diameter } = drawCircleVars(size, stroke);
    
    const d = `M${x} ${y} 
    a ${radius} ${radius} 0 0 1 0 ${diameter}
    a ${radius} ${radius} 0 0 1 0 -${diameter}`

    <svg viewbox="0 0 {size} {size}">
      <path d="{d}" stroke-width="stroke"></path>
    </svg>
  */
  var drawCircleVars = function drawCircleVars(circleWidth, strokeWidth, drawRatio) {
    if (strokeWidth === void 0) {
      strokeWidth = 0;
    }

    if (drawRatio === void 0) {
      drawRatio = 1;
    }

    var circumference = (circleWidth - strokeWidth) / 2 * (3.14159 * 2);
    var radius = circumference / (3.14159 * 2);
    var diameter = radius * 2;
    var x = circleWidth / 2;
    var y = strokeWidth / 2; //const circumLength  = drawRatio == 1 ? drawRatio : drawRatio * circumference;

    return {
      x: x,
      y: y,
      radius: radius,
      diameter: diameter,
      circumference: circumference,
      circleWidth: circleWidth,
      strokeWidth: strokeWidth
    };
  };

  var hasValueProperty = function hasValueProperty(obj, value, key) {
    if (arguments.length == 1 && likeObject(obj)) return isEmpty(obj);
    if (isArray(obj)) for (var i = 0, l = obj.length; i < l; i++) {
      if (obj[i] === value) return true;
    }

    if (likeObject(obj)) {
      if (key) {
        return get(obj, key) === value;
      } else {
        for (var key in obj) {
          if (get(obj, key) === value) return true;
        }
      }
    }

    return false;
  }; //Scale foundation
  //정의역과 치역을 계산하여 결과값을 리턴함, 속성별로 정의하여 다중 차원 지원


  var Block = function Block(posSize, syncOpt) {
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
      }
    });
    this.sync(posSize, syncOpt);
  };

  Block.prototype = {
    sync: function sync(block, syncOpt) {
      console.log('sync1');

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

      console.log('sync2', block);

      if (block instanceof Block) {
        this.$posSize = cloneDeep(block.$posSize); //.. this.$sync    = this.$sync || block.$sync

        this.$space = this.$space || block.$space;
        this.$mask = this.$mask || block.$mask;
      } else {
        this.$posSize = hashMap(cloneDeep(block), function (posSize) {
          return !isArray(posSize) ? [posSize, 0] : posSize;
        });
      }

      console.log('sync3');
      return this;
    },
    clone: function clone$$1() {
      return new Block(this);
    },
    setPosition: function setPosition(value, sel) {
      var $posSize = get(this.$posSize, sel);
      if ($posSize instanceof Array) $posSize[0] = value;
      return this;
    },
    setSize: function setSize(value, sel) {
      var $posSize = get(this.$posSize, sel);
      if ($posSize instanceof Array) $posSize[1] = value;
      return this;
    },
    get: function get$$1() {
      return cloneDeep(typeof this.$posSize === "function" ? this.$posSize() : this.$posSize);
    },
    domainValue: function domainValue() {
      return hashMap(cloneDeep(this.get()), function (posSize) {
        return posSize[0];
      });
    },
    domainSize: function domainSize() {
      return hashMap(cloneDeep(this.get()), function (posSize) {
        return posSize[1];
      });
    },
    domainMap: function domainMap() {
      return hashMap(cloneDeep(this.get()), function (posSize) {
        return {
          start: posSize[0],
          size: posSize[1],
          end: posSize[0] + posSize[1]
        };
      });
    },
    conflicts: function conflicts(otherBlocks, selector) {
      return asArray(otherBlocks).reduce(function (red, block) {
        var selectOtherBlock = get(block, selector);

        if (selectOtherBlock instanceof Block) {
          //다른 블럭이 현재 블럭과 같거나 space가 다를때는 평가하지 않음
          if (selectOtherBlock === this || selectOtherBlock.$space != this.$space) return red; //

          var inspectResult = [];
          hashMap(this.get(), function (thisPos, key) {
            var otherPos = get(selectOtherBlock.get(), key);
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
      var overflowDomain = mask && cloneDeep(mask) || this.$space && this.$space.getDomain() || [];
      return hashMap(overflowDomain, function ($overflowSelected, sel) {
        var $posSize = get(blockPosSize, sel);
        var $domain = get(spaceDomain, sel);
        return $posSize[0] < get($overflowSelected[0], $domain[0]) || $posSize[0] + $posSize[1] > get($overflowSelected[1], $domain[1]);
      });
    },
    isOverflow: function isOverflow(mask) {
      var overflow = false;
      hashMap(this.overflow(mask), function (f) {
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
      return this.$space.domainRange(hashMap(this.get(), function (posSize) {
        return posSize[0];
      }));
    },
    rangeSize: function rangeSize() {
      return this.$space.domainRangeSize(hashMap(this.get(), function (posSize) {
        return posSize[1];
      }));
    },
    rangeMap: function rangeMap() {
      var rangeSize = this.rangeSize();
      return hashMap(this.rangeStart(), function ($start, sel) {
        var $size = sel ? rangeSize[sel] : rangeSize;
        return {
          start: $start,
          size: $size,
          end: $start + $size
        };
      });
    },
    map: function map() {
      var domainMap = this.domainMap();
      var rangeMap = this.rangeMap();
      var blockMap = hashMap(rangeMap, function (map, key) {
        map.rangeStart = map.start;
        map.rangeSize = map.size;
        map.rangeEnd = map.end;
        var $domainMap = get(domainMap, key);
        map.domainStart = $domainMap.start;
        map.domainSize = $domainMap.size;
        map.domainEnd = $domainMap.end;
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
    this.$domainMask = hashMap(cloneDeep(domainMask), function (mask, sel) {
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
      var domainGrid = hashMap(this.$space.getRange(), function (range$$1) {
        return range$$1[2];
      });
      var block = this.block(hashMap(this.$space.rangeDomain(cursor), function (cursorPoint, key) {
        return [cursorPoint, get(domainGrid, key)];
      }));
      var blockMap = block.map();
      callback && callback.call(block, blockMap, block);
      return block;
    }
  };

  var Space = function Space(domain, range$$1) {
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
        set: function set(domain) {
          domain = hashMap(domain, function (domain) {
            if (!domain[2]) {
              domain[2] = 1;
            }

            return domain;
          });
          this.$domain = domain;
        },
        get: function get$$1() {
          return hashMap(cloneDeep(this.$domain), function (domain) {
            for (var i = 0, l = domain.length; i < l; i++) {
              if (typeof domain[i] === "function") domain[i] = domain[i]();
            }

            return domain;
          });
        }
      },
      range: {
        set: function set(range$$1) {
          range$$1 = hashMap(range$$1, function (range$$1) {
            if (!range$$1[2]) {
              range$$1[2] = 1;
            }

            return range$$1;
          });
          this.$range = range$$1;
        },
        get: function get$$1() {
          return hashMap(cloneDeep(this.$range), function (range$$1) {
            for (var i = 0, l = range$$1.length; i < l; i++) {
              if (typeof range$$1[i] === "function") range$$1[i] = range$$1[i]();
            }

            return range$$1;
          });
        }
      }
    });
    this.$domain = domain;
    this.$range = range$$1;
  };

  Space.prototype = {
    domainRangeSize: function domainRangeSize(vs) {
      return hashMap(vs, function (v, sel) {
        var $range = sel ? this.getRange()[sel] : this.getRange();
        var $domain = sel ? this.getDomain()[sel] : this.getDomain();
        return v / ($domain[1] - $domain[0]) * ($range[1] - $range[0]);
      }.bind(this));
    },
    domainRange: function domainRange(vs) {
      return domainRangeValue(this.getDomain(), this.getRange(), vs, this.$niceRange);
    },
    rangeDomain: function rangeDomain(vs) {
      return domainRangeValue(this.getRange(), this.getDomain(), vs, this.$niceDomain);
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
    return function (domain, range$$1) {
      return new Space(domain, range$$1);
    };
  }();
  var block = function () {
    return function (posSize, syncOpt) {
      return new Block(posSize, syncOpt);
    };
  }();

  var EDITABLE_DEFAULT_KEY = "$editable";

  var isEditPossibleDataType = function isEditPossibleDataType(model) {
    return isPlainObject(model);
  };

  var isEditableState = function isEditableState(model) {
    return model[EDITABLE_DEFAULT_KEY] !== undefined;
  };

  var editableModelize = function editableModelize(model) {
    model[EDITABLE_DEFAULT_KEY] = [];
    return model;
  };

  var putEditModel = function putEditModel(destModel, setModel) {
    var putModel = cloneDeep(setModel);

    Object.keys(destModel).forEach(function (key) {
      if (key !== EDITABLE_DEFAULT_KEY) {
        destModel[key] = undefined;
      }
    });
    Object.keys(putModel).forEach(function (key) {
      if (key !== EDITABLE_DEFAULT_KEY) {
        destModel[key] = putModel[key];
      }
    });
    return destModel;
  };

  var cloneCurrentModel = function cloneCurrentModel(model) {
    var currentModelValues = {};
    Object.keys(model).forEach(function (key) {
      if (key !== EDITABLE_DEFAULT_KEY) {
        currentModelValues[key] = model[key];
      }
    });
    return cloneDeep(currentModelValues);
  };

  var pushEditModel = function pushEditModel(model, pushModel) {
    if (!isEditableState(model)) {
      editableModelize(model);
    }

    var editableMeta = model[EDITABLE_DEFAULT_KEY];
    editableMeta.push(cloneCurrentModel(pushModel));
    return model;
  };

  var removeEditModel = function removeEditModel(model) {
    if (isEditPossibleDataType(model) && isEditableState(model)) {
      model[EDITABLE_DEFAULT_KEY] = undefined;
    }

    return model;
  };

  var getOriginalModel = function getOriginalModel(model) {
    return get(model, "[" + EDITABLE_DEFAULT_KEY + "][0]");
  };

  var getLastModel = function getLastModel(model) {
    var changeHistory = get(model, "[" + EDITABLE_DEFAULT_KEY + "]");

    return changeHistory && changeHistory[changeHistory.length - 1];
  };

  var _isEditable = function isEditable(model) {
    if (!isEditPossibleDataType(model)) return false;
    return isEditableState(model);
  };
  var enterEditable = function enterEditable(model) {
    if (!isEditPossibleDataType(model)) return model;

    if (model[EDITABLE_DEFAULT_KEY] !== undefined) {
      return model;
    } else {
      return pushEditModel(model, model);
    }
  };
  var exitEditable = function exitEditable(model, extendModel) {
    if (extendModel === void 0) {
      extendModel = undefined;
    }

    if (!isEditPossibleDataType(model)) return model;

    if (isEditPossibleDataType(extendModel)) {
      var currentExtendModel = cloneCurrentModel(extendModel);
      Object.keys(currentExtendModel).forEach(function (key) {
        model[key] = currentExtendModel[key];
      });
    }

    removeEditModel(model);
    return model;
  };
  var cancleEditable = function cancleEditable(model) {
    if (!isEditPossibleDataType(model)) return model;
    var originalModel = getOriginalModel(model);
    removeEditModel(model);
    putEditModel(model, originalModel);
  };
  var commitEditable = function commitEditable(model) {
    if (!isEditPossibleDataType(model)) return model;
    return pushEditModel(model, model);
  };
  var changedEditable = function changedEditable(model) {
    if (!isEditPossibleDataType(model) || !_isEditable(model)) return false;
    return !isEqual(cloneCurrentModel(model), getLastModel(model));
  };
  var beginEditable = function beginEditable(model) {
    if (!isEditPossibleDataType(model)) return model;

    if (!isEditableState(model)) {
      enterEditable(model);
    } else {
      var historyMeta = model[EDITABLE_DEFAULT_KEY];
      var beginModel = historyMeta[0];
      historyMeta.splice(0, historyMeta.length, beginModel);
      putEditModel(model, beginModel);
    }

    return model;
  };
  var expandEditable = function expandEditable(model) {
    if (!model.hasOwnProperty(EDITABLE_DEFAULT_KEY)) {
      model[EDITABLE_DEFAULT_KEY] = undefined;
    }

    return model;
  };
  var editable = function editable(model) {
    var editableQuery = {
      isEditable: function isEditable() {
        return _isEditable(model);
      },
      isChanged: function isChanged() {
        return changedEditable(model);
      },
      output: function output() {
        return cloneCurrentModel(model);
      },
      free: function free$$1() {
        return free(model);
      },
      expand: function expand() {
        return expandEditable(model);
      },
      begin: function begin() {
        beginEditable(model);
        return editableQuery;
      },
      enter: function enter() {
        enterEditable(model);
        return editableQuery;
      },
      exit: function exit(extendModel) {
        if (extendModel === void 0) {
          extendModel = undefined;
        }

        exitEditable(model, extendModel);
        return editableQuery;
      },
      cancle: function cancle() {
        cancleEditable(model);
        return editableQuery;
      },
      commit: function commit() {
        commitEditable(model);
        return editableQuery;
      }
    };
    return editableQuery;
  };

  var PromiseClass = Promise;
  var resolveFn = PromiseClass.resolve;
  var rejectFn = PromiseClass.reject;
  var newPromise = function newPromise(fn) {
    return new PromiseClass(function (r, c) {
      var maybeAwaiter = fn(r, c);
      likePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
    });
  };
  var promise = function promise(fn) {
    return newPromise(fn);
  };
  var PromiseFunction = promise;
  var all$1 = Promise.all;
  PromiseFunction.all = all$1;
  var resolve = resolveFn;
  PromiseFunction.resolve = resolve;
  var reject = rejectFn;
  PromiseFunction.reject = reject;

  var defer = function defer() {
    var resolve$$1, reject$$1;
    var promise$$1 = new PromiseClass(function () {
      resolve$$1 = arguments[0];
      reject$$1 = arguments[1];
    });
    return {
      resolve: resolve$$1,
      reject: reject$$1,
      promise: promise$$1
    };
  };
  promise.defer = defer;
  var timeout = function timeout(fn, time) {
    if (typeof fn === "number") {
      return newPromise(function (resolve$$1) {
        return setTimeout(function () {
          return resolve$$1(time);
        }, fn);
      });
    } else {
      return newPromise(function (resolve$$1) {
        return setTimeout(function () {
          return resolve$$1(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };
  promise.timeout = timeout;
  var valueOf = function valueOf(maybeQ) {
    return newPromise(function (resolve$$1, reject$$1) {
      likePromise(maybeQ) ? maybeQ.then(resolve$$1).catch(reject$$1) : resolve$$1(maybeQ);
    });
  };
  promise.valueOf = valueOf;
  var promise$1 = promise;

  var operate = function () {
    var PARENT_OUTPUT_UPDATED = "ParentOutputUpdated";

    var operate = function operate(_ref) {
      var _this = this;

      var input = _ref.input,
          output = _ref.output,
          concurrent = _ref.concurrent,
          rescue = _ref.rescue,
          limitInput = _ref.limitInput,
          limitOutput = _ref.limitOutput;
      this.parent = undefined;
      this.children = [];
      this.inputs = [];
      this.outputs = [];
      this.limitInput = isNumber(limitInput) || limitInput > 0 ? limitInput : Number.POSITIVE_INFINITY;
      this.limitOutput = isNumber(limitOutput) || limitOutput > 0 ? limitOutput : Number.POSITIVE_INFINITY; //

      var current = 0;
      concurrent = isNumber(concurrent) || concurrent > 0 ? concurrent : 1;
      Object.defineProperty(this, "avaliablePullCount", {
        get: function get$$1() {
          var limit = _this.limitInput - _this.inputs.length;
          if (limit < 0) limit = 0;
          return limit;
        }
      });
      Object.defineProperty(this, "avaliableOutputCount", {
        get: function get$$1() {
          return _this.limitOutput + current + _this.outputs.length;
        }
      });
      var inputOutput = {
        input: input,
        output: output
      };

      var kickStart = function kickStart() {
        var avaliableQueLength = concurrent - current; // 작동가능한 큐

        if (avaliableQueLength < 1) {
          return;
        } // input의 길이로 확인하여 실행 가능한 큐


        if (avaliableQueLength > _this.inputs.length) {
          avaliableQueLength = _this.inputs.length;
        } // output의 제한을 확인하여 사용 가능한 큐


        if (avaliableQueLength > _this.avaliableOutputCount) {
          avaliableQueLength = _this.avaliableOutputCount;
        }

        if (avaliableQueLength < 1) {
          return;
        }

        Array(avaliableQueLength).fill(inputOutput).forEach(
        /*#__PURE__*/
        function () {
          var _ref3 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(_ref2) {
            var input, output, entry, outputHandle;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    input = _ref2.input, output = _ref2.output;
                    entry = _this.inputs.shift();
                    current++;

                    outputHandle =
                    /*#__PURE__*/
                    function () {
                      var _ref4 = _asyncToGenerator(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee(formInputDataum) {
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                /* TODO:lint
                                if(typeof output === "function"){
                                  const out = await output({ entry: formInputDataum })
                                }
                                */
                                _this.outputs.push(formInputDataum);

                                current--;

                                _this.children.forEach(function (child) {
                                  return child.emit(PARENT_OUTPUT_UPDATED);
                                });

                                kickStart();

                              case 4:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee, this);
                      }));

                      return function outputHandle(_x2) {
                        return _ref4.apply(this, arguments);
                      };
                    }();

                    if (!input) {
                      _context2.next = 23;
                      break;
                    }

                    _context2.prev = 5;
                    _context2.t0 = outputHandle;
                    _context2.next = 9;
                    return input({
                      entry: entry
                    });

                  case 9:
                    _context2.t1 = _context2.sent;
                    (0, _context2.t0)(_context2.t1);
                    _context2.next = 21;
                    break;

                  case 13:
                    _context2.prev = 13;
                    _context2.t2 = _context2["catch"](5);

                    if (!(typeof rescue === "function")) {
                      _context2.next = 19;
                      break;
                    }

                    rescue(_context2.t2);
                    _context2.next = 20;
                    break;

                  case 19:
                    throw _context2.t2;

                  case 20:
                    current--;

                  case 21:
                    _context2.next = 24;
                    break;

                  case 23:
                    outputHandle(entry);

                  case 24:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this, [[5, 13]]);
          }));

          return function (_x) {
            return _ref3.apply(this, arguments);
          };
        }());
      };

      Object.defineProperty(this, "push", {
        value: function value(pushData) {
          _this.inputs.push(pushData);

          kickStart();
          return _this;
        }
      });
      Object.defineProperty(this, "concat", {
        value: function value(pushData) {
          asArray(pushData).forEach(function (d) {
            return _this.inputs.push(d);
          });
          kickStart();
          return _this;
        }
      });
      Object.defineProperty(this, "emit", {
        value: function value(eventName, payload) {
          switch (eventName) {
            case PARENT_OUTPUT_UPDATED:
              if (_this.avaliablePullCount < 1) return;

              var pullData = _this.parent.pull(_this.avaliablePullCount);

              if (pullData.length < 1) return;
              pullData.forEach(function (datum) {
                return _this.inputs.push(datum);
              });
              kickStart();
              break;
          }
        }
      });
      Object.defineProperty(this, "pull", {
        value: function value(pullLength) {
          if (!(isNumber(pullLength) || pullLength == Number.POSITIVE_INFINITY)) return [];

          var pullData = _this.outputs.splice(0, pullLength); //pullData.length && kickStart();


          return pullData;
        }
      });
      Object.defineProperty(this, "clone", {
        value: function value(deep$$1, parentOperate) {
          if (deep$$1 === void 0) {
            deep$$1 = true;
          }

          var cloneOperate = operateFunction({
            input: input,
            output: output,
            concurrent: concurrent,
            rescue: rescue,
            limitInput: limitInput,
            limitOutput: limitOutput
          });
          deep$$1 === true && _this.children.forEach(function (child) {
            child.clone(true, cloneOperate);
          });
          return cloneOperate;
        }
      });
    };

    operate.prototype = {
      append: function append(child) {
        child.parent = this;
        this.children.push(child);
        return this;
      },
      remove: function remove(child) {
        var index = this.children.indexOf(child);
        if (index < 0) return this;
        child.parent = undefined;
        this.children.splice(index, 1);
      },
      operate: function operate(option) {
        return this.append(operateFunction(option));
      }
    };

    var operateFunction = function operateFunction(option) {
      return new operate(Object.assign({}, option));
    };

    return operateFunction;
  }();

  var abortMessage = new function () {
    Object.defineProperty(this, "message", {
      get: function get() {
        return ":abort";
      }
    });
    Object.defineProperty(this, "abort", {
      get: function get() {
        return true;
      }
    });
  }();
  var abort = function abort(notifyConsole) {
    if (notifyConsole === void 0) {
      notifyConsole = undefined;
    }

    return new PromiseClass(function (resolve$$1, reject$$1) {
      if (notifyConsole === true) {
        console.warn("abort promise");
      }

      reject$$1(abortMessage);
    });
  };

  var awaitLeadOnly = function awaitLeadOnly(func) {
    return alloc(function () {
      var $pending = false;
      return function () {
        var _this = this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if ($pending === true) {
          return abort();
        } else {
          $pending = true;
          return promise$1(function (resolve$$1, reject$$1) {
            return valueOf(func.apply(_this, args)).then(resolve$$1).catch(reject$$1);
          }).then(function (e) {
            $pending = false;
            return e;
          }).catch(function (e) {
            $pending = false;
            return reject(e);
          });
        }
      };
    });
  };
  var awaitCompose = function awaitCompose(funcArgs) {
    return alloc(function () {
      var composeFuncs = [];
      asArray(funcArgs).forEach(function (f) {
        typeof f === "function" && composeFuncs.push(f);
      });
      return function (payload) {
        var _this2 = this;

        return promise$1(function (resolve$$1, reject$$1) {
          var _marked =
          /*#__PURE__*/
          regeneratorRuntime.mark(iterator);

          function iterator() {
            var d, i, l;
            return regeneratorRuntime.wrap(function iterator$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    d = composeFuncs, i = 0, l = d.length;

                  case 1:
                    if (!(i < l)) {
                      _context.next = 7;
                      break;
                    }

                    _context.next = 4;
                    return d[i];

                  case 4:
                    i++;
                    _context.next = 1;
                    break;

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _marked, this);
          }

          var doWhile = function doWhile(_ref, taskPayload) {
            var proc = _ref.value,
                done = _ref.done;

            if (done) {
              resolve$$1(taskPayload);
            } else {
              valueOf(proc.call(_this2, taskPayload)).then(function (nextPayload) {
                doWhile(iterator.next(), nextPayload);
              }).catch(reject$$1);
            }
          };

          doWhile.apply(iterator.next(), payload);
        });
      };
    });
  };
  /*
    수동 watch로직 입니다.
    let watcher = watchChange(newValue=>{ doSomething... })
    watcher.change("newValue")
  */

  var watchChange = function watchChange() {
    var changeValue = function changeValue(watchman, newValue) {
      var countScope = watchman.$count;

      var destOldValue = cloneDeep(newValue);

      watchman.$setter.forEach(function (effect) {
        effect(newValue, watchman.$oldValue, countScope);
      });
      watchman.$oldValue = destOldValue;
    };

    var Watchman = function Watchman(equalityLogic) {
      this.$setter = [];
      this.$oldValue = undefined;
      this.$count = 0;
      this.$equalityLogic = equalityLogic;
    };

    Watchman.prototype = {
      setter: function setter(changeListeners) {
        var _this3 = this;

        asArray(changeListeners).forEach(function (fn) {
          if (typeof fn === "function") {
            _this3.$setter.push(fn);
          }
        });
      },
      change: function change(newValue) {
        var newValue;

        if (this.$equalityLogic) {
          if (!isEqual(this.$oldValue, newValue)) {
            changeValue(this, newValue);
          }
        } else {
          if (this.$oldValue != newValue) {
            changeValue(this, newValue);
          }
        }
      }
    };
    return function (effect, equalityLogic) {
      var watch = new Watchman(equalityLogic);
      watch.setter(effect);
      return watch;
    };
  };

  var PaginateClass = function PaginateClass(opts) {
    // current page index
    this.page = 0; // page per display item length

    this.pagePer = 10; // paginate per display page length

    this.paginatePer = 10; // totalItem count

    this.totalItems = 0; // extra payload

    this.parameters = {}; // pages ouput style ( all | existOnly )

    this.pagesOutputStyle = 'existOnly';
    this.$pending = false;
    this.$fetchFn = opts.fetch;
    this.$renderFn = opts.render;
    this.update(opts);
    this.$fetchState = -1;

    if (typeof this.$fetchFn !== "function") {
      console.error("paginate::fetch 초기 옵션에 반드시 합수를 선언해 주세요");
    }

    if (typeof this.$renderFn !== "function") {
      console.error("paginate::render 초기 옵션에 반드시 함수를 선언해 주세요");
    }
  };

  PaginateClass.prototype = {
    isAllowPaginate: function isAllowPaginate(needTo) {
      return needTo > -1 && needTo < this.paginateLimit;
    },
    isAllowIndex: function isAllowIndex(needTo, pagelimit) {
      pagelimit = typeof pagelimit === "number" ? pagelimit : this.pageLimit;
      if (pagelimit < 0) return false;
      return needTo > -1 && needTo <= pagelimit;
    },
    fetch: function fetch(payload) {
      var _this = this;

      if (this.$fetchState != -1) {
        return promise$1.reject(new Error("paginate::다른 페이징 작업 중에 페이징 처리를 할 수 없습니다."));
      }

      if (typeof payload === "object") {
        payload = Object.assign(this.pageState, this.parameters, payload);
      }

      this.$fetchState = 0;
      this.$pending = true;
      return promise$1(function (resolve$$1, reject$$1) {
        promise$1.valueOf(_this.$fetchFn(payload)).then(function (e) {
          if (_this.$fetchState == 0) {
            console.warn("paginate::fetch중엔 반드시 update를 해 주십시오");
          }

          _this.$fetchState = -1;
          _this.$pending = true;
          resolve$$1(e);
        }).catch(function (e) {
          _this.$fetchState = -1;
          _this.$pending = true;
          reject$$1(e);
        });
      });
    },
    update: function update(updateOpts) {
      this.hasOwnProperty("$fetchState") && this.$fetchState++;

      if (updateOpts === null || updateOpts === "abort") {
        return;
      }

      this.page = updateOpts.page > -1 ? updateOpts.page : this.page;
      this.pagePer = updateOpts.pagePer || this.pagePer;
      this.paginatePer = updateOpts.paginatePer || this.paginatePer;
      this.totalItems = typeof updateOpts.totalItems === "number" ? updateOpts.totalItems : this.totalItems;

      if (typeof updateOpts.parameters === "object") {
        this.parameters = Object.assign({}, this.parameters, updateOpts.parameters);
      }

      if (typeof this.$renderFn === "function") {
        this.$renderFn(this);
      } else {
        console.warn("paginate::render 함수를 찾을수 없습니다. 반드시 설정해주세요.");
      }
    },
    params: function params(parameters) {
      if (parameters === null) {
        this.parameters = {};
      } else if (typeof parameters === "object") {
        this.parameters = parameters;
      } else {
        console.warn("paginate:parameters는 object 파라메터만 받을수 있습니다.");
      }

      return this;
    },
    refresh: function refresh() {
      return this.fetch({
        page: this.page
      });
    },
    fetchIndex: function fetchIndex(pageIndex) {
      // 설정할수 있는 페이지보다 너무 높으면
      if (pageIndex < 0) {
        return promise$1.reject("paginate::-1 이하로 페이지네이션에 접근 할 수 없습니다.");
      }

      if (this.pageLimit < pageIndex) {
        pageIndex = this.pageLimit;

        if (pageIndex < 0) {
          pageIndex = 0;
        }
      }

      return this.fetch({
        page: pageIndex
      });
    },
    fetchNext: function fetchNext() {
      return this.fetchIndex(this.page + 1);
    },
    fetchPrev: function fetchPrev() {
      return this.fetchIndex(this.page - 1);
    },
    fetchTo: function fetchTo(command) {
      var _this2 = this;

      var action;

      switch (command) {
        case "next":
        case "nextPage":
          action = function action(e) {
            return _this2.fetchNext();
          };

          break;

        case "prev":
        case "prevPage":
          action = function action(e) {
            return _this2.fetchPrev();
          };

          break;

        case "firstPage":
          action = function action(e) {
            return _this2.fetchIndex(0);
          };

          break;

        case "lastPage":
          action = function action(e) {
            return _this2.fetchIndex(_this2.pageLimit);
          };

          break;

        /* TODO : if needed
        case "nextPaginate":
          break;
        case "prevPaginate":
          break;
          */

        default:
          if (typeof command === "number") {
            action = function action(e) {
              return _this2.fetchIndex(command);
            };
          }

      }

      if (action) {
        return action();
      } else {
        return promise$1.reject("paginate::unknown command", command);
      }
    }
  }; // pagenation에서 이동 가능한 index의 크기를 반환함

  Object.defineProperty(PaginateClass.prototype, "pageLimit", {
    get: function get() {
      var fixIndex = this.totalItems / this.pagePer; // polyfill Number.isInteger

      if (typeof fixIndex === "number" && isFinite(fixIndex) && Math.floor(fixIndex) === fixIndex) {
        return fixIndex - 1;
      } else {
        return Math.floor(fixIndex);
      }
    }
  }); // pagenation에서 이동 가능한 paginate의 크기를 반환함

  Object.defineProperty(PaginateClass.prototype, "paginateLimit", {
    get: function get() {
      return Math.ceil(this.totalItems / (this.pagePer * this.paginatePer));
    }
  }); // pagenation에서 이동 가능한 index의 크기를 반환함

  Object.defineProperty(PaginateClass.prototype, "paginate", {
    get: function get() {
      var paginate = Math.floor(this.page / this.paginatePer);

      if (paginate < 0) {
        paginate = 0;
      }

      return paginate;
    }
  });
  Object.defineProperty(PaginateClass.prototype, "pageState", {
    get: function get() {
      return {
        page: this.page,
        pagePer: this.pagePer,
        paginatePer: this.paginatePer,
        totalItems: this.totalItems
      };
    }
  });
  Object.defineProperty(PaginateClass.prototype, "pages", {
    get: function get() {
      // paginate 설정
      var startPageIndex = this.paginatePer * this.paginate;
      var endPageIndex = startPageIndex + this.paginatePer; // 렌더링에 필요한 numberItems 생성

      var numberItems = [];
      var pageLimit = this.pageLimit;

      for (; startPageIndex < endPageIndex; startPageIndex++) {
        numberItems.push({
          index: startPageIndex,
          number: startPageIndex + 1,
          $disabled: !this.isAllowIndex(startPageIndex, pageLimit),
          $active: this.page == startPageIndex
        });
      } // ui 페이지 번호 출력 보정


      switch (this.pagesOutputStyle) {
        case "existOnly":
          if (pageLimit < 1) {
            numberItems.splice(1, Number.POSITIVE_INFINITY);
          } else {
            var disabledStartIndex = 0;

            for (var d = numberItems, i = 0, l = d.length; i < l; i++) {
              if (d[i].$disabled == false) disabledStartIndex = i + 1;
            }

            if (disabledStartIndex) {
              numberItems.splice(disabledStartIndex, Number.POSITIVE_INFINITY);
            }
          }

          break;

        case "all":
        default:
          // is ok
          break;
      }

      return numberItems;
    }
  });
  Object.defineProperty(PaginateClass.prototype, "allowNext", {
    get: function get() {
      return this.isAllowIndex(this.page + 1, this.pageLimit);
    }
  });
  Object.defineProperty(PaginateClass.prototype, "allowPrev", {
    get: function get() {
      return this.isAllowIndex(this.page - 1, this.pageLimit);
    }
  });
  Object.defineProperty(PaginateClass.prototype, "allowNextPaginate", {
    get: function get() {
      return this.isAllowPaginate(this.paginate + 1);
    }
  });
  Object.defineProperty(PaginateClass.prototype, "allowPrevPaginate", {
    get: function get() {
      return this.isAllowPaginate(this.paginate - 1);
    }
  });
  Object.defineProperty(PaginateClass.prototype, "viewmodel", {
    enumerable: false,
    get: function get() {
      var _this3 = this;

      return {
        page: this.page,
        pagePer: this.pagePer,
        paginatePer: this.paginatePer,
        totalItems: this.totalItems,
        allowNext: this.allowNext,
        allowPrev: this.allowPrev,
        allowNextPaginate: this.allowNextPaginate,
        allowPrevPaginate: this.allowPrevPaginate,
        pages: this.pages,
        parameters: Object.keys(this.parameters).reduce(function (dest, name) {
          dest[name] = _this3.parameters[name];
          return dest;
        }, {})
      };
    }
  });

  var paginateFactory = function paginateFactory(e) {
    return new PaginateClass(e);
  };

  paginateFactory.constructor = PaginateClass;
  var Paginate = PaginateClass;
  var paginate = paginateFactory;

  var SESSION_STORE = {};
  var STATE_STORE = {};
  /*
  let idx = 0;
  session("scopeName").open((name)=>{ id:idx++, name });

  let { item, resolve } = await session("scopeName").spawn("bob");
  resolve(item);

  let { item, resolve } = await session("scopeName").spawn("cat");
  resolve(item);

  session("scopeName").close()
  */

  var session = function session(name) {
    var inst = {
      outputs: function outputs() {
        return STATE_STORE[name].map(function (e) {
          return e.output;
        });
      },
      open: function open(fn) {
        SESSION_STORE[name] = fn;
        STATE_STORE[name] = [];
      },
      close: function close() {
        var result = inst.outputs();
        delete SESSION_STORE[name];
        delete STATE_STORE[name];
        return Promise.all(result);
      },
      spawn: function spawn(payload) {
        if (typeof SESSION_STORE[name] !== "function") {
          if (!SESSION_STORE[name]) {
            throw new Error("session:: " + name + " is not defined");
          } else {
            throw new Error("session:: " + name + " is not function callback");
          }
        }

        var input = promise$1.valueOf(SESSION_STORE[name](payload));
        var managedSpawn = {
          input: input,
          output: undefined,
          item: undefined
        };
        return input.then(function (item) {
          var deferred = promise$1.defer();
          var deferPromise = deferred.promise;
          managedSpawn.output = deferPromise;
          managedSpawn.item = item;
          STATE_STORE[name].push(managedSpawn);
          return {
            item: item,
            resolve: deferred.resolve,
            reject: deferred.reject
          };
        });
      }
    };
    return inst;
  };

  var Limitter = function Limitter(max, min) {
    this.value = 0;

    if (typeof max !== "number" || isAbsoluteNaN(min)) {
      this.maximum = Number.POSITIVE_INFINITY;
    } else {
      this.maximum = max;
    }

    if (typeof min !== "number" || isAbsoluteNaN(min)) {
      this.minimum = 0;
    } else {
      this.minimum = min;
    }
  };
  var LimitterPrototype = {
    expectIn: function expectIn(setValue) {
      return setValue === limitNumber(setValue, this.maximum, this.minimum);
    },
    expectOut: function expectOut(setValue) {
      return setValue !== limitNumber(setValue, this.maximum, this.minimum);
    },
    addExpectIn: function addExpectIn(addValue) {
      var destValue = this.value + addValue;
      return destValue === limitNumber(destValue, this.maximum, this.minimum);
    },
    addExpectOut: function addExpectOut(addValue) {
      var destValue = this.value + addValue;
      return destValue !== limitNumber(destValue, this.maximum, this.minimum);
    },
    set: function set(setValue) {
      this.value = setValue;
      return this;
    },
    add: function add(addValue) {
      this.value = this.value + addValue;
      return this;
    }
  };
  Object.defineProperties(LimitterPrototype, {
    done: {
      get: function get$$1() {
        return this.value === limitNumber(this.value, this.maximum, this.minimum);
      }
    }
  });
  Limitter.prototype = LimitterPrototype;
  var ranger = function ranger(max, min) {
    return new Limitter(max, min);
  };

  var MatrixArray = function () {
    var MatrixArray = function MatrixArray(data, column, row) {
      var _this = this;

      asArray(data).forEach(function (datum) {
        _this.push(datum);
      });
      Object.defineProperties(this, {
        column: {
          enumerable: false,
          value: column
        },
        row: {
          enumerable: false,
          value: row
        },
        length: {
          enumerable: false
        }
      });
    };

    MatrixArray.prototype = Object.assign([], {
      toMatrix: function toMatrix(eachResultHook) {
        var _this2 = this;

        var result = [];
        eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined;
        times(this.column * this.row, function (index) {
          var _turnTime = turnTime(index, _this2.column),
              colIndex = _turnTime[0],
              rowIndex = _turnTime[1];

          var data = _this2[index];
          var dataResult = eachResultHook ? eachResultHook(data, index, colIndex, rowIndex) : data;
          if (!result[rowIndex]) result[rowIndex] = [];
          result[rowIndex].push(dataResult);
        });
        return result;
      },
      toArray: function toArray$$1() {
        return Array.from(this);
      },
      eachColumn: function eachColumn(eachFn) {
        var rows = this.toMatrix();
        var columns = times(this.column, function (colIndex) {
          var colData = [];
          rows.forEach(function (row) {
            return colData.push(row[colIndex]);
          });
          return colData;
        });
        return typeof eachFn === "function" ? columns.map(eachFn) : columns;
      },
      eachRow: function eachRow(eachFn) {
        var rows = this.toMatrix();
        return typeof eachFn === "function" ? rows.map(eachFn) : rows;
      },
      multiply: function multiply() {//TODO
      }
    });
    return MatrixArray;
  }();
  var makeMatrixArray = function makeMatrixArray(column, row, eachHook) {
    var matrixProto = times(column * row, function (index) {
      var _turnTime2 = turnTime(index, column),
          colIndex = _turnTime2[0],
          rowIndex = _turnTime2[1];

      return eachHook(index, colIndex, rowIndex) || [colIndex, rowIndex];
    });
    var matrixArray = new MatrixArray(matrixProto, column, row);
    return matrixArray;
  };

  var likePoint = function likePoint(p) {
    return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y");
  };

  var calcTransformedPoint = function calcTransformedPoint(__ref, _ref) {
    var matrix = _ref.matrix,
        perspectiveOrigin = _ref.perspectiveOrigin;
    // yet support affin
    //let perspectiveVar = (this.meta && this.meta.perspective)
    //perspectiveVar = !isNumber(perspectiveVar) ? 0 : perspectiveVar;
    //perspectiveVar = -1/perspectiveVar;
    //perspectiveVar = isInfinity(perspectiveVar) ? 0 : (perspectiveVar || 0) ;
    if (!matrix) return;
    var transformPoint = {};

    var _ref2 = perspectiveOrigin || {
      x: 0,
      y: 0,
      z: 0
    },
        _ref2$x = _ref2.x,
        px = _ref2$x === void 0 ? 0 : _ref2$x,
        _ref2$y = _ref2.y,
        py = _ref2$y === void 0 ? 0 : _ref2$y,
        _ref2$z = _ref2.z,
        pz = _ref2$z === void 0 ? 0 : _ref2$z;

    var _multiplyMatrix = multiplyMatrix(matrix, [[__ref.x - px], [__ref.y - py], [__ref.z - pz], [__ref.w]]),
        _multiplyMatrix$ = _multiplyMatrix[0],
        x = _multiplyMatrix$[0],
        _multiplyMatrix$2 = _multiplyMatrix[1],
        y = _multiplyMatrix$2[0],
        _multiplyMatrix$3 = _multiplyMatrix[2],
        z = _multiplyMatrix$3[0],
        _multiplyMatrix$4 = _multiplyMatrix[3],
        w = _multiplyMatrix$4[0];

    transformPoint.x = x + px + matrix[0][3];
    transformPoint.y = y + py + matrix[1][3];
    transformPoint.z = z + pz + matrix[2][3];
    transformPoint.w = w;
    return transformPoint;
  };

  var Point = function Point(x, y, z, w, meta) {
    var _this = this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (z === void 0) {
      z = 0;
    }

    if (w === void 0) {
      w = 1;
    }

    // base point config
    var __ref = {
      x: x,
      y: y,
      z: z,
      w: w
    };
    var __meta = {};

    var __transformedPoint;

    Object.defineProperties(this, {
      x: {
        enumerable: true,
        get: function get() {
          if (_this.transform === true) {
            !__transformedPoint && (__transformedPoint = calcTransformedPoint(__ref, _this.meta));
            return __transformedPoint ? __transformedPoint.x : __ref.x;
          }

          return __ref.x;
        },
        set: function set(v) {
          __transformedPoint = undefined;
          __ref.x = v;
        }
      },
      y: {
        enumerable: true,
        get: function get() {
          if (_this.transform === true) {
            !__transformedPoint && (__transformedPoint = calcTransformedPoint(__ref, _this.meta));
            return __transformedPoint ? __transformedPoint.y : __ref.y;
          }

          return __ref.y;
        },
        set: function set(v) {
          __transformedPoint = undefined;
          __ref.y = v;
        }
      },
      z: {
        enumerable: true,
        get: function get() {
          if (_this.transform === true) {
            !__transformedPoint && (__transformedPoint = calcTransformedPoint(__ref, _this.meta));
            return __transformedPoint ? __transformedPoint.z : __ref.z;
          }

          return __ref.z;
        },
        set: function set(v) {
          __transformedPoint = undefined;
          __ref.z = v;
        }
      },
      w: {
        enumerable: true,
        get: function get() {
          if (_this.transform === true) {
            !__transformedPoint && (__transformedPoint = calcTransformedPoint(__ref, _this.meta));
            return __transformedPoint ? __transformedPoint.w : __ref.w;
          }

          return __ref.w;
        },
        set: function set(v) {
          __transformedPoint = undefined;
          __ref.w = v;
        }
      },
      meta: {
        enumerable: false,
        get: function get() {
          return __meta;
        },
        set: function set(it) {
          typeof it === "object" && Object.assign(__meta, it);
          __transformedPoint = undefined;
          return __meta;
        }
      },
      transform: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: false
      },
      rx: {
        enumerable: false,
        get: function get() {
          var rangeWidth = _this.meta && _this.meta.range && _this.meta.range.width || 0;
          return _this.x / rangeWidth;
        }
      },
      ry: {
        enumerable: false,
        get: function get() {
          var rangeHeight = _this.meta && _this.meta.range && _this.meta.range.height || 0;
          return _this.y / rangeHeight;
        }
      }
    });

    if (typeof meta === "object") {
      this.meta = meta;
    }
  };

  Point.prototype = {
    addMeta: function addMeta(obj) {
      if (typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj);
      return this;
    },
    clone: function clone$$1() {
      return new Point(this.x, this.y, this.z, this.w, this.meta);
    },
    call: function call(fn) {
      if (typeof fn === "function") {
        return fn(this) || this;
      }

      return this;
    },
    toJSON: function toJSON(withMeta) {
      var json = {
        x: this.x,
        y: this.y,
        z: this.z,
        w: this.w
      };
      if (withMeta === true && this.meta) json.meta = this.meta;
      return json;
    },
    pull: function pull(width, angle) {
      if (width === void 0) {
        width = 0;
      }

      if (angle === void 0) {
        angle = "horizontal";
      }

      var x = this.x,
          y = this.y,
          z = this.z,
          w = this.w;

      switch (angle) {
        case "h":
        case "horizontal":
          var xHalf = width <= 0 ? 0 : width / 2;
          return new Vertex([{
            x: x - xHalf,
            y: y,
            z: z,
            w: w
          }, {
            x: x + xHalf,
            y: y,
            z: z,
            w: w
          }]);

        default:
      }
    },
    vertexWith: function vertexWith(destPoint) {
      var points = asArray(destPoint);
      points.unshift(this);
      return new Vertex(points);
    },
    rectWith: function rectWith(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;

      var _ref4 = this.x > x ? [this.x, x] : [x, this.x],
          largeX = _ref4[0],
          smallX = _ref4[1];

      var _ref5 = this.y > y ? [this.y, y] : [y, this.y],
          largeY = _ref5[0],
          smallY = _ref5[1];

      return new Rect(smallX, smallY, largeX - smallX, largeY - smallY, 0, 0);
    },
    applyTransform: function applyTransform(matrix44) {
      if (matrix44 === void 0) {
        matrix44 = this.meta.matrix;
      }

      if (!validMatrix(matrix44)) {
        this.transform = false;
        throw new Error('Point::applyTransform invalid matrix', matrix44);
        return this;
      }

      this.meta.matrix = matrix44;
      this.transform = true;
      return this;
    }
  };

  var Vertex = function Vertex(pointArray, meta) {
    var _this2 = this;

    var __meta;

    Object.defineProperties(this, {
      meta: {
        enumerable: false,
        get: function get() {
          return __meta;
        },
        set: function set(it) {
          __meta = typeof it === "object" ? it : null;
          return __meta;
        }
      }
    });
    this.meta = meta;
    asArray(pointArray).forEach(function (point) {
      if (!likePoint(point)) return;
      var x = point.x,
          y = point.y,
          z = point.z,
          w = point.w;

      _this2.push(new Point(x, y, z, w, __meta));
    });
  };

  (function (classFunction, methods) {
    var prototype = [];
    classFunction.prototype = prototype;
    Object.keys(methods).forEach(function (key) {
      prototype[key] = methods[key];
    });
    Object.defineProperties(prototype, {
      start: {
        enumerable: false,
        get: function get() {
          return this[0];
        }
      },
      end: {
        enumerable: false,
        get: function get() {
          return !this.length ? void 0 : this[this.length - 1];
        }
      }
    });
  })(Vertex, {
    addMeta: function addMeta(obj) {
      if (typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj);
      return this;
    },
    toJSON: function toJSON(withMeta) {
      var result = [];
      this.forEach(function (p) {
        return result.push(p.toJSON(withMeta));
      });
      return result;
    },
    clone: function clone$$1() {
      return new Vertex(this);
    },
    eq: function eq(index) {
      return this[index];
    },
    join: function join(fn) {
      var _this3 = this;

      var joins = [];
      this.forEach(function (refp, i) {
        joins.push(refp);
        if (!_this3[i + 1]) return;
        var newp = fn(refp, _this3[i + 1], i);
        if (!likePoint(newp)) return;
        var x = newp.x,
            y = newp.y,
            z = newp.z,
            w = newp.w,
            meta = newp.meta;
        joins.push(new Point(x, y, z, w, meta));
      });
      this.splice(0, this.length);
      joins.forEach(function (p) {
        return _this3.push(p);
      });
      return this;
    },
    point: function point(order) {
      switch (order) {
        case "e":
        case "end":
        case "d":
        case "down":
        case "r":
        case "right":
          var _this$end = this.end,
              px = _this$end.x,
              py = _this$end.y,
              pz = _this$end.z,
              pw = _this$end.w;
          return new Point(px, py, pz, pw, this.meta);

        case "c":
        case "m":
        case "center":
        case "middle":
          var _this$start = this.start,
              sx = _this$start.x,
              sy = _this$start.y,
              sz = _this$start.z,
              sw = _this$start.w;
          var _this$end2 = this.end,
              ex = _this$end2.x,
              ey = _this$end2.y,
              ez = _this$end2.z,
              ew = _this$end2.w;
          return new Point(sx / 2 + ex / 2, sy / 2 + ey / 2, sz / 2 + ez / 2, sw / 2 + ew / 2, this.meta);

        case "s":
        case "start":
        case "u":
        case "up":
        case "l":
        case "left":
        default:
          var _this$start2 = this.start,
              x = _this$start2.x,
              y = _this$start2.y,
              z = _this$start2.z,
              w = _this$start2.w;
          return new Point(x, y, z, w, this.meta);
      }
    },
    rect: function rect() {
      var first = this[0];

      if (!first) {
        return new Rect(0, 0, 0, 0);
      }

      var left = first.x;
      var right = first.x;
      var top = first.y;
      var bottom = first.y;

      for (var d = this, i = 1, l = this.length; i < l; i++) {
        var p = d[i];
        p.x < left && (left = p.x);
        p.x > right && (right = p.x);
        p.y < top && (top = p.y);
        p.y > bottom && (bottom = p.y);
      }

      return new Rect(left, top, right - left, bottom - top);
    },
    applyTransform: function applyTransform(param) {
      this.forEach(function (p) {
        return p.applyTransform(param);
      });
      return this;
    }
  });

  var Rect = function Rect(left, top, width, height, meta) {
    if (left === void 0) {
      left = 0;
    }

    if (top === void 0) {
      top = 0;
    }

    if (width === void 0) {
      width = 0;
    }

    if (height === void 0) {
      height = 0;
    }

    if (meta === void 0) {
      meta = null;
    }

    var __ref = {
      left: left,
      top: top,
      width: width,
      height: height
    };
    var __meta = {};
    Object.defineProperties(this, {
      width: {
        enumerable: true,
        get: function get() {
          return __ref.width;
        },
        set: function set(newValue) {
          var oldValue = __ref.width;
          __ref.width = newValue;
          __ref.right += newValue - oldValue;
          return newValue;
        }
      },
      height: {
        enumerable: true,
        get: function get() {
          return __ref.height;
        },
        set: function set(newValue) {
          var oldValue = __ref.height;
          __ref.height = newValue;
          __ref.bottom += newValue - oldValue;
          return newValue;
        }
      },
      left: {
        enumerable: true,
        get: function get() {
          return __ref.left;
        }
      },
      top: {
        enumerable: true,
        get: function get() {
          return __ref.top;
        }
      },
      right: {
        enumerable: true,
        get: function get() {
          return this.left + this.width;
        }
      },
      bottom: {
        enumerable: true,
        get: function get() {
          return this.top + this.height;
        }
      },
      meta: {
        enumerable: false,
        get: function get() {
          return __meta;
        },
        set: function set(it) {
          typeof it === "object" && Object.assign(__meta, it);
          return __meta;
        }
      }
    });

    if (typeof meta === "object") {
      this.meta = meta;
    }
  };

  var splitCountParser = function splitCountParser(split) {
    //splitCount [ horizental, vertical ]
    //1 = [ 1 ]
    //[1, 2] = [1, 2]
    var _asArray = asArray(split),
        columnOrder = _asArray[0],
        rowOrder = _asArray[1];

    return {
      column: isNumber(columnOrder) && columnOrder > 0 ? parseInt(columnOrder, 10) : 1,
      row: isNumber(rowOrder) && rowOrder > 0 ? parseInt(rowOrder, 10) : 1
    };
  };

  Rect.prototype = {
    addMeta: function addMeta(obj) {
      if (typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj);
      return this;
    },
    clone: function clone$$1() {
      return new Rect(this.left, this.top, this.width, this.height, this.meta);
    },
    toJSON: function toJSON(withMeta) {
      var json = {
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top,
        right: this.right,
        bottom: this.bottom
      };
      if (withMeta === true && this.meta) json.meta = this.meta;
      return json;
    },
    defaultPerspective: function defaultPerspective() {
      return {
        perspective: 0,
        perspectiveOrigin: {
          x: this.left + this.width / 2,
          y: this.top + this.height / 2,
          z: 0
        }
      };
    },
    findPoint: function findPoint(findWord) {
      var _ref6 = isArray(findWord) ? findWord : findWord.trim().split(/\s+/),
          lineFind = _ref6[0],
          pointFind = _ref6[1];

      return this.vertex(lineFind).point(pointFind);
    },
    vertex: function vertex(order) {
      var inheritMeta = Object.assign(this.defaultPerspective(), this.meta);

      switch (order) {
        case "right":
        case "r":
          return new Vertex([{
            x: this.right,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.bottom,
            z: 0,
            w: 0
          }], inheritMeta);

        case "bottom":
        case "b":
          return new Vertex([{
            x: this.left,
            y: this.bottom,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.bottom,
            z: 0,
            w: 0
          }], inheritMeta);

        case "left":
        case "l":
          return new Vertex([{
            x: this.left,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: this.left,
            y: this.bottom,
            z: 0,
            w: 0
          }], inheritMeta);

        case "top":
        case "t":
          return new Vertex([{
            x: this.left,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.top,
            z: 0,
            w: 0
          }], inheritMeta);

        case "middle":
        case "m":
          var middleY = this.height / 2 + this.top;
          return new Vertex([{
            x: this.left,
            y: middleY,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: middleY,
            z: 0,
            w: 0
          }], inheritMeta);

        case "center":
        case "c":
          var centerX = this.width / 2 + this.x;
          return new Vertex([{
            x: centerX,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: centerX,
            y: this.bottom,
            z: 0,
            w: 0
          }], inheritMeta);

        default:
          return new Vertex([{
            x: this.left,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: this.left,
            y: this.bottom,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.bottom,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.top,
            z: 0,
            w: 0
          }], inheritMeta);
      }
    },
    transformRect: function transformRect() {
      this.vertex();
    },
    piecesWithCount: function piecesWithCount(splitCount, eachResultHook) {
      var _splitCountParser = splitCountParser(splitCount),
          column = _splitCountParser.column,
          row = _splitCountParser.row;

      var width = this.width;
      var height = this.height;
      var pieceWidth = width / column;
      var pieceHeight = height / row;
      eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined;

      var pacExt = _objectSpread({}, this.defaultPerspective());

      if (this.meta.matrix && this.meta.matrix instanceof Array) {
        Object.assign(pacExt, {
          matrix: this.meta.matrix
        });
      }

      var pacResult = makeMatrixArray(column, row, function (index, colIndex, rowIndex) {
        var pacMeta = _objectSpread({
          column: colIndex,
          row: rowIndex,
          coords: [colIndex, rowIndex],
          range: {
            width: width,
            height: height
          }
        }, pacExt); //


        var result = new Rect(colIndex * pieceWidth, rowIndex * pieceHeight, pieceWidth, pieceHeight, pacMeta);
        return eachResultHook ? eachResultHook(result, index, colIndex, rowIndex) : result;
      });
      return pacResult;
    },
    diff: function diff(_ref7) {
      var aleft = _ref7.left,
          atop = _ref7.top,
          awidth = _ref7.width,
          aheight = _ref7.height,
          aright = _ref7.right,
          abottom = _ref7.bottom;
      var diffResult = {};
      var original = this.toJSON();
      var offset = {
        left: 0,
        top: 0
      };
      Object.defineProperties(diffResult, {
        left: {
          enumerable: true,
          get: function get() {
            return original.left - aleft + offset.left;
          },
          set: function set(want) {
            offset.left = typeof want === "number" ? -original.left + want : 0;
          }
        },
        top: {
          enumerable: true,
          get: function get() {
            return original.top - atop + offset.top;
          },
          set: function set(want) {
            offset.top = typeof want === "number" ? -original.top + want : 0;
          }
        },
        width: {
          enumerable: true,
          get: function get() {
            return original.width - awidth;
          }
        },
        height: {
          enumerable: true,
          get: function get() {
            return original.height - aheight;
          }
        },
        right: {
          enumerable: true,
          get: function get() {
            return original.right - aright + offset.left;
          }
        },
        bottom: {
          enumerable: true,
          get: function get() {
            return original.bottom - abottom + offset.top;
          }
        },
        x: {
          enumerable: false,
          get: function get() {
            return offset.left;
          }
        },
        y: {
          enumerable: false,
          get: function get() {
            return offset.top;
          }
        },
        offset: {
          enumerable: false,
          get: function get() {
            return function () {
              return {
                x: offset.left,
                y: offset.top,
                right: diffResult.right,
                bottom: diffResult.bottom,
                over: diffResult.right > diffResult.bottom ? diffResult.right : diffResult.bottom
              };
            };
          }
        },
        move: {
          enumerable: false,
          get: function get() {
            return function (nleft, ntop) {
              diffResult.left = typeof nleft === "number" ? nleft : aleft;
              diffResult.top = typeof ntop === "number" ? ntop : atop;
              return diffResult;
            };
          }
        },
        toJSON: {
          enumerable: false,
          get: function get() {
            return function () {
              return _objectSpread({}, diffResult);
            };
          }
        }
      });
      return diffResult;
    },
    fit: function fit(rect) {
      if (typeof rect !== "object") {
        throw new Error("fit::argument[0] is not object");
      }

      var width = rect.width,
          height = rect.height;

      if (!isNumber(width) || !isNumber(height)) {
        throw new Error("fit::argument[0] is not { width:Number, height:Number }");
      }

      var WHRatio = [width / this.width, height / this.height];
      var transformRatio = WHRatio.sort()[0];
      this.width = this.width * transformRatio || 0;
      this.height = this.height * transformRatio || 0;
      return this;
    },
    //TODO : incompleted sticky(parent, position, offset);
    sticky: function sticky(_ref8, position) {
      var refX = _ref8.left,
          refY = _ref8.top,
          refWidth = _ref8.width,
          refHeight = _ref8.height;

      if (position === void 0) {
        position = "bottom left";
      }

      var left = this.left,
          top = this.top,
          width = this.width,
          height = this.height;

      switch (position) {
        case "bl":
        case "obl":
        case "bottom left":
        case "outer bottom left":
          return rect({
            left: refX,
            top: refY + refHeight,
            width: width,
            height: height
          });

        case "c":
        case "m":
        case "mc":
        case "center":
        case "middle":
        case "middle center":
          return rect({
            left: refX + refWidth / 2 - width / 2,
            top: refY + refHeight / 2 - height / 2,
            width: width,
            height: height
          });

        default:
          return rect({
            left: left,
            top: top,
            width: width,
            height: height
          });
      }
    }
  };
  var point = function point(x, y, z, w) {
    return typeof x === "object" ? new Point(x.x, x.y, x.z, x.w) : new Point(x, y, z, w);
  };
  var vertex = function vertex(start, end) {
    return new Vertex([{
      x: start.x,
      y: start.y,
      z: start.z,
      w: start.w
    }, {
      x: end.x,
      y: end.y,
      z: end.z,
      w: end.w
    }]);
  };
  var rect = function rect(left, top, width, height, x, y, valid) {
    return typeof left === "object" ? new Rect(left.left, left.top, left.width, left.height, left.x, left.y, left.valid) : new Rect(left, top, width, height, x, y, valid);
  };

  var ManualReactive = function ManualReactive(watch, effect, judgeOfEqual) {
    this.watch = watch;
    this.effect = effect;
    this.judgeOfEqual = typeof judgeOfEqual === "function" ? judgeOfEqual : function (a, b) {
      return a === b;
    };
    this.oldValue = undefined;
  };

  ManualReactive.prototype = {
    beginAffect: function beginAffect(watchValue) {
      this.effect(watchValue, cloneDeep(this.oldValue));
      this.oldValue = watchValue;
    },
    digest: function digest() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var watchResult = this.watch.apply(this, args);
      return this.judgeOfEqual(this.oldValue, watchResult) ? false : (this.beginAffect(watchResult), true);
    }
  };
  var affect = function affect(effect, judgeOfEqual) {
    var affectValue;
    var manualReactive = new ManualReactive(function () {
      return affectValue;
    }, effect, judgeOfEqual);
    return function (value) {
      affectValue = value;
      manualReactive.digest();
    };
  };



  var functions = /*#__PURE__*/Object.freeze({
    unique: unique,
    getKeyBy: getKeyBy,
    clearOf: clearOf,
    insertOf: insertOf,
    moveOf: moveOf,
    concatOf: concatOf,
    filterOf: filterOf,
    sortOf: sortOf,
    rebase: rebase,
    diffStructure: diffStructure,
    isAbsoluteNaN: isAbsoluteNaN,
    isNone: isNone,
    isNumber: isNumber,
    isInfinity: isInfinity,
    isInteger: isInteger,
    isArray: isArray,
    isObject: isObject,
    isFunction: isFunction,
    likeObject: likeObject,
    likeString: likeString,
    likeNumber: likeNumber,
    likeArray: likeArray,
    isPlainObject: isPlainObject,
    isEnumerableObject: isEnumerableObject,
    isNode: isNode,
    isEmpty: isEmpty,
    isPresence: isPresence,
    likeRegexp: likeRegexp,
    eqof: eqof,
    isEqual: isEqual,
    likeEqual: likeEqual,
    eqeq: eqeq,
    isExsist: isExsist,
    notExsist: notExsist,
    likePromise: likePromise,
    asArray: asArray,
    toArray: toArray,
    asObject: asObject,
    toNumber: toNumber,
    cleanObject: cleanObject,
    clone: clone,
    cloneDeep: cloneDeep,
    free: free,
    removeValue: removeValue,
    instance: instance,
    alloc: alloc,
    all: all,
    deep: deep,
    times: times,
    hashMap: hashMap,
    cut: cut,
    cuts: cuts,
    top: top,
    rand64: rand64,
    tokenize: tokenize,
    randRange: randRange,
    rangeModel: rangeModel,
    range: range,
    domainRangeValue: domainRangeValue,
    domainRangeInterpolate: domainRangeInterpolate,
    matrixRange: matrixRange,
    validMatrix: validMatrix,
    asMatrix: asMatrix,
    multiplyMatrix: multiplyMatrix,
    dateExp: dateExp,
    timestampExp: timestampExp,
    timescaleExp: timescaleExp,
    limitNumber: limitNumber,
    accurateTimeout: accurateTimeout,
    turn: turn,
    turnTime: turnTime,
    toggle: toggle,
    keys: keys,
    entries: entries,
    deepKeys: deepKeys,
    matchString: matchString,
    findIndex: findIndex,
    findIndexes: findIndexes,
    readString: readString,
    readPath: readPath,
    get: get,
    hasProperty: hasProperty,
    hasValue: hasValue,
    argumentNamesBy: argumentNamesBy,
    scopelizeBy: scopelizeBy,
    drawCircleVars: drawCircleVars,
    fill: fill,
    promise: promise$1,
    space: space,
    block: block,
    isEditable: _isEditable,
    enterEditable: enterEditable,
    exitEditable: exitEditable,
    cancleEditable: cancleEditable,
    commitEditable: commitEditable,
    changedEditable: changedEditable,
    beginEditable: beginEditable,
    expandEditable: expandEditable,
    editable: editable,
    awaitLeadOnly: awaitLeadOnly,
    awaitCompose: awaitCompose,
    watchChange: watchChange,
    Paginate: Paginate,
    paginate: paginate,
    operate: operate,
    session: session,
    Limitter: Limitter,
    ranger: ranger,
    point: point,
    vertex: vertex,
    rect: rect,
    affect: affect,
    MatrixArray: MatrixArray,
    makeMatrixArray: makeMatrixArray
  });

  var Bow = function Bow() {};

  var BowFactory = function BowFactory(fns) {
    var BOX = function BOX(payload) {
      return new Bow(payload);
    };

    function applyBoxFns(BowFns) {
      for (var name in BowFns) {
        BOX[name] = BowFns[name];
      }
    }

    applyBoxFns(fns);
    return BOX;
  };

  var DEFAULT = BowFactory(_objectSpread({}, functions));
  var factory = BowFactory;

  var DEFAULT$1 = factory(_objectSpread({}, functions));

  return DEFAULT$1;

})));
//# sourceMappingURL=pado.js.map
