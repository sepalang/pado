(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./baseFunction"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./baseFunction"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.baseFunction);
    global.cast = mod.exports;
  }
})(this, function (_exports, _isLike, _baseFunction) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.alloc = _exports.instance = _exports.purge = _exports.purgeOf = _exports.free = _exports.freeOf = _exports.compact = _exports.compactOf = _exports.pick = _exports.pickOf = _exports.omit = _exports.omitOf = _exports.rebase = _exports.sort = _exports.sortOf = _exports.clearOf = _exports.insert = _exports.insertOf = _exports.filter = _exports.filterOf = _exports.concat = _exports.concatOf = _exports.move = _exports.moveOf = _exports.getKeyBy = _exports.unique = _exports.removeValue = _exports.cloneDeep = _exports.clone = _exports.cleanObject = _exports.toNumber = _exports.asObject = _exports.toArray = _exports.asArray = void 0;
  var asArray = _baseFunction.baseAsArray;
  _exports.asArray = asArray;

  var toArray = function toArray(data, option) {
    if (typeof data === "undefined" || data === null || (0, _isLike.isAbsoluteNaN)(data)) return [];
    if ((0, _isLike.isArray)(data)) return Array.prototype.slice.call(data);
    if (typeof data === "object" && typeof data.toArray === "function") return data.toArray();
    if (typeof data === "string" && typeof option === "string") return data.split(option);
    return [data];
  };

  _exports.toArray = toArray;

  var asObject = function asObject(data, defaultKey) {
    if (defaultKey === void 0) {
      defaultKey = "default";
    }

    if ((0, _isLike.isPlainObject)(data)) {
      return data;
    } else {
      var _ref;

      return _ref = {}, _ref[defaultKey] = data, _ref;
    }
  };

  _exports.asObject = asObject;

  var toNumber = function toNumber(v, d) {
    switch (typeof v) {
      case "number":
        return v;

      case "string":
        var vr = v.replace(/[^.\d\-]/g, "") * 1;
        return (0, _isLike.isAbsoluteNaN)(vr) ? 0 : vr;
        break;
    }

    switch (typeof d) {
      case "number":
        return d;

      case "string":
        var dr = d * 1;
        return (0, _isLike.isAbsoluteNaN)(dr) ? 0 : dr;
        break;
    }

    return 0;
  };

  _exports.toNumber = toNumber;

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

  _exports.cleanObject = cleanObject;

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

        if ((0, _isLike.isArray)(target)) {
          var _r = [];

          for (var i = 0, length = target.length; i < length; i++) {
            _r.push(target[i]);
          }

          return _r;
        }

        if (!(0, _isLike.isPlainObject)(target)) {
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

  _exports.clone = clone;

  var cloneDeep = function cloneDeep(target) {
    if (typeof target === "object") {
      var d;

      if ((0, _isLike.isArray)(target)) {
        if (!(0, _isLike.isArray)(d)) {
          d = [];
        }

        ;

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

  _exports.cloneDeep = cloneDeep;

  var getKeyWithValue = function getKeyWithValue(obj, value) {
    if ((0, _isLike.isArray)(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (obj[i] === value) return i;
      }
    }

    if ((0, _isLike.isObject)(obj)) {
      for (var key in obj) {
        if (obj[key] === value) return key;
      }
    }

    return undefined;
  };

  var removeValue = function removeValue(obj, value) {
    var detect = true;
    var array = (0, _isLike.isArray)(obj);

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
  }; // Only one unique value is left.


  _exports.removeValue = removeValue;

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

  _exports.unique = unique;

  var getKeyBy = function getKeyBy(object, value) {
    if ((0, _isLike.isFunction)(value)) {
      if ((0, _isLike.isArray)(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (value(object[i], i) === true) return i;
      }
      if ((0, _isLike.isObject)(object)) for (var key in object) {
        if (value(object[key], key) === true) return key;
      }
    } else {
      if ((0, _isLike.isArray)(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (object[i] === value) return i;
      }
      if ((0, _isLike.isObject)(object)) for (var key in object) {
        if (object[key] === value) return key;
      }
    }
  }; // Change the positions of the specified indexes in the array


  _exports.getKeyBy = getKeyBy;

  var moveOf = function moveOf(data, oldIndex, newIndex) {
    data = asArray(data);
    oldIndex !== newIndex && (0, _isLike.isNumber)(oldIndex) && (0, _isLike.isNumber)(newIndex) && oldIndex >= 0 && oldIndex < data.length && Array.prototype.splice.call(data, newIndex > data.length ? data.length : newIndex, 0, Array.prototype.splice.call(data, oldIndex, 1)[0]);
    return data;
  };

  _exports.moveOf = moveOf;

  var move = function move(data, oldIndex, newIndex) {
    return moveOf(toArray(data), oldIndex, newIndex);
  }; // Supports self concat.


  _exports.move = move;

  var baseConcatOf = function baseConcatOf(data, args) {
    var result = asArray(data);
    return args.forEach(function (data) {
      asArray(data).forEach(function (value) {
        result.push(value);
      });
    }), result;
  };

  var concatOf = function concatOf(data) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return baseConcatOf(data, args);
  };

  _exports.concatOf = concatOf;

  var concat = function concat(data) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return baseConcatOf(toArray(data), args);
  }; // Removes the value of data that does not return a positive value to the filter function.


  _exports.concat = concat;

  var filterOf = function filterOf(data, filterFn, exitFn) {
    var dataArray = asArray(data);
    var dataKeys = (0, _baseFunction.baseKeys)(data);
    var isOnExit = typeof exitFn === "function";
    var exitArray = isOnExit ? [] : null;

    for (var i = 0, removedIndex = 0, l = dataKeys.length; i < l; i++, removedIndex++) {
      var datumKey = dataKeys[i];
      var datum = dataArray[datumKey];

      if (filterFn(datum, datumKey) !== true) {
        var exitDatum = dataArray.splice(i, 1);
        i--;
        l--;
        isOnExit && exitArray.push([removedIndex, exitDatum]);
      }
    }

    isOnExit && exitFn(exitArray, dataArray);
    return dataArray;
  };

  _exports.filterOf = filterOf;

  var filter = function filter(data, func, exitFn) {
    return filterOf(toArray(data), func, exitFn);
  }; // Put the specified value in the specified index.


  _exports.filter = filter;

  var insertOf = function insertOf(data, v, a) {
    data = asArray(data);
    return data.splice(typeof a === "number" ? a : 0, 0, v), data;
  };

  _exports.insertOf = insertOf;

  var insert = function insert(data, v, a) {
    return insertOf(toArray(data), v, a);
  }; // Removes all contents of an array or object.


  _exports.insert = insert;

  var clearOf = function clearOf(data, fillFn, sp) {
    if ((0, _isLike.isArray)(data)) {
      sp = Array.prototype.splice.call(data, 0, data.length);
    } else if (typeof data == "object") {
      sp = {};

      for (var key in data) {
        sp[key] = data[key];
        delete data[key];
      }
    }

    return fillFn && fillFn(data, sp), data;
  }; // sort


  _exports.clearOf = clearOf;

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
      ;
    }

    return data;
  };

  _exports.sortOf = sortOf;

  var sort = function sort(data, filter) {
    return sortOf(toArray(data), filter);
  }; // If have defined multiple key names in one hash, change them appropriately.
  // rebase({ "a,b":1 }) => { "a":1, "b":1 }


  _exports.sort = sort;

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
            if (typeof refValue !== "object" && typeof refValue !== "object" || (0, _isLike.isNode)(refValue)) {
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
            if (!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object" || (0, _isLike.isNode)(obj[key])) {
              result[deepKey] = obj[key];
            } else {
              result[deepKey] = Object.assign(result[deepKey] || ((0, _isLike.isArray)(obj[key]) ? [] : {}), obj[key], obj[deepKey]);
            }
          }
        });
      } else {
        if (typeof obj[key] === "function") {
          result[key] = obj[key];
        } else {
          if (typeof result[key] !== "object" && typeof obj[key] !== "object" || (0, _isLike.isNode)(obj[key])) {
            result[key] = obj[key];
          } else {
            result[key] = Object.assign(result[key], obj[key]);
          }
        }
      }
    }

    return result;
  };

  _exports.rebase = rebase;

  var removeKey = function removeKey(datum, rule) {
    if (!(0, _isLike.isObject)(datum)) return datum;
    var removeRule = typeof rule === "function" ? function (key, value) {
      return rule(value, key);
    } : rule;
    var removeKeys = (0, _baseFunction.baseKeys)(datum, removeRule);
    if (!removeKeys.length) return datum;
    (0, _isLike.isArray)(datum) ? removeKeys.forEach(function (originalIndex, offset) {
      var removeIndex = originalIndex - offset;
      datum.splice(removeIndex, 1);
    }) : removeKeys.forEach(function (key) {
      delete datum[key];
    });
    return datum;
  }; // If the rule matches the rule, remove the key


  var omitOf = function omitOf(datum, rule) {
    return removeKey(datum, rule);
  };

  _exports.omitOf = omitOf;

  var omit = function omit(datum, rule) {
    return omitOf(clone(datum), rule);
  }; // If the rule matches the rule, preserve the key.


  _exports.omit = omit;

  var pickOf = function pickOf(datum, rule) {
    return removeKey(datum, function (value, key) {
      return !(0, _baseFunction.stringTest)(key, rule, value);
    });
  };

  _exports.pickOf = pickOf;

  var pick = function pick(datum, rule) {
    return pickOf(clone(datum), rule);
  }; // Remove the key that has a value of undefined
  //const COMPACT_MATCH_FN = value=>typeof value !== "undefined"


  _exports.pick = pick;

  var COMPACT_MATCH_FN = function COMPACT_MATCH_FN(value) {
    return typeof value === "undefined";
  };

  var compactOf = function compactOf(datum) {
    return omitOf(datum, COMPACT_MATCH_FN);
  };

  _exports.compactOf = compactOf;

  var compact = function compact(datum) {
    return compactOf(clone(datum));
  }; // Clears key values starting with $


  _exports.compact = compact;
  var FREE_MATCH_EXPRESSION = /^\$/;

  var freeOf = function freeOf(datum) {
    return omitOf(datum, FREE_MATCH_EXPRESSION);
  };

  _exports.freeOf = freeOf;

  var free = function free(datum) {
    return freeOf(clone(datum));
  }; // Remove the key that begins with $ or has a value of undefined.


  _exports.free = free;

  var purgeOf = function purgeOf(datum) {
    return omitOf(datum, function (value, key) {
      return FREE_MATCH_EXPRESSION.test(key) || COMPACT_MATCH_FN(value);
    });
  };

  _exports.purgeOf = purgeOf;

  var purge = function purge(datum) {
    return purgeOf(clone(datum));
  };
  /* Experimental
  export const injectOf = (data,injectFn)=>keys(data).reduce((dest, key)=>((dest[key] = injectFn(dest[key], key)), dest),asObject(data))
  export const inject = (data, injectFn)=>injectOf(clone(data), injectFn);
  
  export const mapOf = (data, mapFn)=>asArray(data).map(mapFn);
  export const map = (data, mapFn)=>mapOf(clone(data), mapFn);
  */
  //


  _exports.purge = purge;

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

  _exports.instance = instance;

  var alloc = function alloc(init) {
    var fn = init();

    var rn = function rn() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
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


  _exports.alloc = alloc;
});
//# sourceMappingURL=cast.js.map