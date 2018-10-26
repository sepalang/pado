(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.split", "core-js/modules/es6.regexp.replace"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.split"), require("core-js/modules/es6.regexp.replace"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.es6Regexp);
    global.castString = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _es6Regexp2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.camelCase = _exports.pascalCase = void 0;

  var baseCaseSplit = function baseCaseSplit(s) {
    s = s.replace(/^\#/, "").trim();
    var e = s.split(/\s+/);
    if (e.length > 1) return e;
    var k = s.split(/\-+/);
    if (k.length > 1) return k;

    var _ = s.split(/\_+/);

    if (_.length > 1) return _;
    return s.replace(/[A-Z][a-z]/g, function (s) {
      return "%@" + s;
    }).replace(/^\%\@/, "").split("%@");
  };

  var pascalCase = function pascalCase(string, joinString) {
    if (joinString === void 0) {
      joinString = "";
    }

    var words = baseCaseSplit(string);

    for (var i = 0, l = words.length; i < l; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    return words.join(joinString);
  };

  _exports.pascalCase = pascalCase;

  var camelCase = function camelCase(string, joinString) {
    if (joinString === void 0) {
      joinString = "";
    }

    var pascalCaseString = pascalCase(string, joinString);
    return "" + (pascalCaseString.substr(0, 1) || '') + (pascalCaseString.substr(1) || '');
  };

  _exports.camelCase = camelCase;
});
//# sourceMappingURL=castString.js.map