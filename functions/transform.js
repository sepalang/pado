(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.find-index", "core-js/modules/es6.regexp.replace", "core-js/modules/es6.regexp.split", "./isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.find-index"), require("core-js/modules/es6.regexp.replace"), require("core-js/modules/es6.regexp.split"), require("./isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Regexp, global.es6Regexp, global.isLike);
    global.transform = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Regexp, _es6Regexp2, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.alloc = _exports.instance = _exports.removeValue = _exports.free = _exports.cloneDeep = _exports.clone = _exports.cleanObject = _exports.toNumber = _exports.asObject = _exports.toArray = _exports.asArray = void 0;

  var asArray = function asArray(data, defaultArray) {
    if (defaultArray === void 0) {
      defaultArray = undefined;
    }

    if ((0, _isLike.isArray)(data)) {
      return data;
    }

    if ((0, _isLike.isNone)(data)) {
      return (0, _isLike.isArray)(defaultArray) ? defaultArray : (0, _isLike.isNone)(defaultArray) ? [] : [defaultArray];
    }

    if (typeof data === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }

    return [data];
  };

  _exports.asArray = asArray;

  var toArray = function toArray(data, option) {
    if (typeof data === "undefined" || data === null || data === NaN) return [];
    if ((0, _isLike.isArray)(data)) return Array.prototype.slice.call(data);
    if (typeof data === "object" && typeof data.toArray === "function") return data.toArray();
    if (typeof data === "string", typeof option === "string") return data.split(option);
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
        var r = v.replace(/[^.\d\-]/g, "") * 1;
        return (0, _isLike.isAbsoluteNaN)(r) ? 0 : r;
        break;
    }

    switch (typeof d) {
      case "number":
        return d;

      case "string":
        var r = d * 1;
        return (0, _isLike.isAbsoluteNaN)(r) ? 0 : r;
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
    var d;

    if (typeof target === "object") {
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
      clone(target);
    }
  };

  _exports.cloneDeep = cloneDeep;

  var free = function free(datum) {
    var dest = {};
    Object.keys(datum).forEach(function (key) {
      if (!/^\$/.test(key)) {
        dest[key] = _cloneDeep(datum[key]);
      }
    });
    return dest;
  };

  _exports.free = free;

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
  };

  _exports.removeValue = removeValue;

  var instance = function instance(func, proto) {
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

  _exports.instance = instance;

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
  };

  _exports.alloc = alloc;

  var syncData = function () {
    var ENTER_HOOK = function ENTER_HOOK(newDatum) {
      return _.assign({}, newDatum);
    };

    var UPDATE_HOOK = function UPDATE_HOOK(oldDatum, newDatum) {
      return _.assign({}, oldDatum, newDatum);
    };

    return function (oldData, newData, getId, options) {
      if (!/string|function/.test(typeof getId)) throw new Error("syncData need getId");

      if (typeof getId === "string") {
        var getIdString = getId;

        getId = function getId(e) {
          return _.get(e, getIdString);
        };
      }

      oldData = asArray(oldData);
      newData = asArray(newData);
      var result = [];
      var hooks = asObject(options, "afterEach");

      if (typeof hooks["enter"] !== "function") {
        hooks["enter"] = ENTER_HOOK;
      }

      if (typeof hooks["update"] !== "function") {
        hooks["update"] = UPDATE_HOOK;
      }

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
            }); // inspect key chnage

            if (_.isEqual(oldOwnKeys, newOwnKeys)) {
              dirty = !_.isEqual(_.pick(oldDatum, oldOwnKeys), _.pick(newDatum, newOwnKeys));
            } else {
              dirty = true;
            }
          }

          if (typeof hooks["beforeUpdate"] === "function") {
            if (hooks["beforeUpdate"](oldDatum, newDatum) === false) {
              return;
            }
          }

          genDatum = hooks["update"](oldDatum, newDatum);

          if (typeof hooks["afterUpdate"] === "function") {
            genDatum = hooks["afterUpdate"](genDatum, oldDatum, newDatum);
          }
        } else {
          if (typeof hooks["beforeEnter"] === "function") {
            if (hooks["beforeEnter"](newDatum) === false) {
              return;
            }
          }

          genDatum = hooks["enter"](newDatum);

          if (typeof hooks["afterEnter"] === "function") {
            genDatum = hooks["afterEnter"](genDatum, newDatum);
          }
        }

        if (typeof hooks["afterEach"] === "function") {
          hooks["afterEach"](genDatum, i, dirty);
        }

        result.push(genDatum);
      });

      return result;
    };
  }();
});