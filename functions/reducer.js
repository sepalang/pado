(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.match", "./isLike", "./cast", "./enumerator", "lodash/get"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.match"), require("./isLike"), require("./cast"), require("./enumerator"), require("lodash/get"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.isLike, global.cast, global.enumerator, global.get);
    global.reducer = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _isLike, _cast, _enumerator, _get2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.max = _exports.turn = _exports.hasValueProperty = _exports.hasProperty = _exports.get = _exports.castPath = _exports.castString = void 0;
  _get2 = _interopRequireDefault(_get2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var castString = function castString(text, defaultOrder, finder, at) {
    if (typeof text === "string" || typeof text === "number") {
      var idxs = [];
      var hist = [];
      var count = 0;
      var pin = !at || !(0, _isLike.isNumber)(at) || at < 0 ? 0 : at;
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

          if ((0, _isLike.likeRegexp)(nextOrder)) {
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

  _exports.castString = castString;

  var castPath = function castPath(pathParam) {
    if ((0, _isLike.isArray)(pathParam)) {
      return pathParam;
    }

    if ((0, _isLike.likeString)(pathParam)) {
      if ((0, _isLike.isNumber)(pathParam)) {
        return [pathParam];
      }

      if (typeof pathParam === "string") {}
    }

    return [];
  };

  _exports.castPath = castPath;

  var get = function get(target, path) {
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

  _exports.get = get;

  var hasProperty = function hasProperty(target, pathParam) {
    return (0, _enumerator.all)(castPath(pathParam), function (path) {
      if ((0, _isLike.likeObject)(target) && (0, _isLike.likeString)(path) && target.hasOwnProperty(path)) {
        target = target[path];
        return true;
      }

      return false;
    });
  };

  _exports.hasProperty = hasProperty;

  var hasValueProperty = function hasValueProperty(obj, value, key) {
    if (arguments.length == 1 && (0, _isLike.likeObject)(obj)) return (0, _isLike.isEmpty)(obj);
    if ((0, _isLike.isArray)(obj)) for (var i = 0, l = obj.length; i < l; i++) {
      if (obj[i] === value) return true;
    }

    if ((0, _isLike.likeObject)(obj)) {
      if (key) {
        return (0, _get2.default)(obj, key) === value;
      } else {
        for (var key in obj) {
          if ((0, _get2.default)(obj, key) === value) return true;
        }
      }
    }

    return false;
  };

  _exports.hasValueProperty = hasValueProperty;

  var turn = function turn(i, p, ts) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = p - (abs > p ? abs % p : abs);
    }

    ts = ts || 1;
    i = Math.floor(i / ts);
    return p > i ? i : i % p;
  };

  _exports.turn = turn;

  var max = function max(numberList) {
    var result;
    (0, _cast.asArray)(numberList).forEach(function (n) {
      if ((0, _isLike.isNumber)(n)) {
        if (typeof result !== "number") {
          result = n;
          return;
        }

        if (result < n) {
          result = n;
        }
      }
    });
    return result;
  };

  _exports.max = max;
});
//# sourceMappingURL=reducer.js.map