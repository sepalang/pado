(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/es6.regexp.split", "core-js/modules/web.dom.iterable", "core-js/modules/es6.regexp.to-string", "../../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/es6.regexp.split"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.regexp.to-string"), require("../../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Object, global.es6Regexp, global.webDom, global.es6Regexp, global.functions);
    global.url = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Object, _es6Regexp, _webDom, _es6Regexp2, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.serialize = _exports.readUrl = void 0;

  var readUrl = function readUrl(inputUrl) {
    var info;
    var url;

    try {
      url = inputUrl ? inputUrl : window.document.URL.toString();
      info = /([\w]+)(\:[\/]+)([^/]*\@|)([\w\d\.\-\_\+]+)(\:[\d]+|)(\/|)([\w\d\.\/\-\_\;\=]+|)(\?[\d\w\=\&\%\,\.\/\(\)-]+|)(\#[\d\w]*|)/.exec(url);
    } catch (e) {
      info = null;
    }

    if (info === null) {
      console.error("faild parse url", inputUrl);
      return {
        url: url || null,
        valid: false
      };
    }

    var protocol = info[1];
    var divider = info[2];
    var userinfo = info[3];
    var hostname = info[4];
    var port = info[5].substring(1);
    var path = info[6] + info[7];
    var query = info[8];
    var fragment = info[9];
    var filename = /(\/|)([\w\d\.\-\_]+|)$/.exec(info[6] + info[7])[2];
    var host = info[1] + info[2] + info[4] + info[5];

    var params = function () {
      var result = {};

      if (query) {
        query.substr(1).split("&").forEach(function (onePiece) {
          var entry = onePiece.split("=");
          result[decodeURI(entry[0])] = decodeURI(entry[1]);
        });
      }

      return result;
    }();

    return {
      url: url,
      protocol: protocol,
      divider: divider,
      userinfo: userinfo,
      hostname: hostname,
      port: port,
      path: path,
      query: query,
      fragment: fragment,
      filename: filename,
      host: host,
      params: params,
      valid: true
    };
  };

  _exports.readUrl = readUrl;

  var serialize = function serialize(obj, transform) {
    var params = [];
    var invalid = [];
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];
      var stringValue = "";

      if (typeof value === "undefined") {
        return;
      } else if (value === null) {
        stringValue = "";
      } else if ((0, _functions.isArray)(value)) {
        return value.each(function (val) {
          typeof transform === "function" ? params.push(transform(key) + "=" + transform(val)) : params.push(key + "=" + val);
        });
      } else if (typeof value === "object") {
        return invalid.push(key);
      } else {
        stringValue = value + "";
      }

      typeof transform === "function" ? params.push(transform(key) + "=" + transform(stringValue)) : params.push(key + "=" + stringValue);
    });

    if (invalid.length) {
      invalid = null;
    }

    return params.join("&");
  };

  _exports.serialize = serialize;
});
//# sourceMappingURL=url.js.map