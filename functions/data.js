(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "./cast", "./read"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("./cast"), require("./read"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.cast, global.read);
    global.data = mod.exports;
  }
})(this, function (_exports, _webDom, _cast, _read) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.groupBy = _exports.zips = _exports.zip = void 0;

  var zip = function zip(keys, values) {
    var asArrayValues = (0, _cast.asArray)(values);
    return (0, _cast.asArray)(keys).reduce(function (dest, key, index) {
      dest[key] = asArrayValues[index];
      return dest;
    }, {});
  };

  _exports.zip = zip;

  var zips = function zips(keys, valuesArray) {
    return (0, _cast.asArray)(valuesArray).map(function (values) {
      return zip(keys, values);
    });
  }; //export const unzip = (ziped)=>{
  //  if(typeof ziped !== "object" || !ziped) return {};
  //  Object.keys(ziped).reduce((dest,zipedKey)=>{
  //    dest[0].push(zipedKey)
  //    dest[1].push(ziped[zipedKey])
  //    return dest
  //  }.[[],[]])
  //}
  //
  //export const unzips = ((zipedArray)=>asArray(zipedArray).map(ziped=>unzip(ziped))


  _exports.zips = zips;

  var groupBy = function groupBy(data, groupKey) {
    var result = {};
    (0, _cast.asArray)(data).forEach(function (datum, index) {
      var setKey = typeof groupKey === "function" ? groupKey(datum, index) : groupKey;
      var setValue = (0, _read.get)(datum, setKey);
      result[setKey] ? result[setKey].push(setValue) : result[setKey] = [setValue];
    });
    return result;
  }; // TODO : merge


  _exports.groupBy = groupBy;
});
//# sourceMappingURL=data.js.map