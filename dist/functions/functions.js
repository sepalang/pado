(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.functions = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var isNullify = exports.isNullify = function isNullify(data) {
    if (typeof data === "number") return isNaN(data);
    return data === undefined || data === null;
  };

  var isArray = exports.isArray = function isArray(data) {
    return Array.isArray(data) || data instanceof Array;
  };

  var asArray = exports.asArray = function asArray(data) {
    var defaultArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    if (isArray(data)) {
      return data;
    }
    if (isNullify(data)) {
      return isArray(defaultArray) ? defaultArray : isNullify(defaultArray) ? [] : [defaultArray];
    }
    if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }
    return [data];
  };

  var isPositiveProp = exports.isPositiveProp = function isPositiveProp(value) {
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

  var isNegativeProp = exports.isNegativeProp = function isNegativeProp(value) {
    return !isPositiveProp(value);
  };

  var refreshData = exports.refreshData = function refreshData(oldData, newData, getId, afterHook) {
    if (!/string|function/.test(typeof getId === "undefined" ? "undefined" : _typeof(getId))) throw new Error("refreshData need getId");
    if (typeof getId === "string") {
      var getIdString = getId;
      getId = function getId(e) {
        return _.get(e, getIdString);
      };
    }

    oldData = asArray(oldData);
    newData = asArray(newData);

    var result = [];

    var oldDataMap = _.map(oldData, function (e) {
      return { id: getId(e), ref: e };
    });

    _.each(newData, function (newDatum, i) {
      var newId = getId(newDatum);
      var oldDatum = _.get(oldDataMap[_.findIndex(oldDataMap, function (e) {
        return e.id === newId;
      })], "ref");
      var genDatum = void 0;
      var dirty = false;

      if (oldDatum) {
        // change is not dirty, modify is dirty
        if ((typeof oldDatum === "undefined" ? "undefined" : _typeof(oldDatum)) !== (typeof newDatum === "undefined" ? "undefined" : _typeof(newDatum))) {
          dirty = false;
        } else {
          // same type
          var oldOwnKeys = Object.keys(oldDatum).filter(function (key) {
            return !(key.indexOf("$") === 0);
          });
          var newOwnKeys = Object.keys(newDatum).filter(function (key) {
            return !(key.indexOf("$") === 0);
          });

          //inspect key chnage
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

  var all = exports.all = function all(data, fn) {
    data = asArray(data);

    if (data.length === 0) {
      return false;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      if (!fn(data[i], i)) {
        return false;
      }
    };

    return true;
  };
});