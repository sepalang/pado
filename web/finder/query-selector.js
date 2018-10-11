(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.split", "core-js/modules/es6.regexp.replace", "core-js/modules/es6.string.iterator", "core-js/modules/es6.array.from", "../../functions/cast", "../../functions/isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.split"), require("core-js/modules/es6.regexp.replace"), require("core-js/modules/es6.string.iterator"), require("core-js/modules/es6.array.from"), require("../../functions/cast"), require("../../functions/isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.es6Regexp, global.es6String, global.es6Array, global.cast, global.isLike);
    global.querySelector = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _es6Regexp2, _es6String, _es6Array, _cast, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.toCSSQueryString = _exports.query = _exports.is = _exports.nodeList = void 0;

  var QUERY_SELECTOR_ENGINE = function QUERY_SELECTOR_ENGINE(node, selector) {
    try {
      return Array.from((node || document)[QUERY_SELECTOR_NAME](selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function (s) {
        return s.replace(/\=.+\]$/, function (s) {
          return '=\"' + s.substr(1, s.length - 2) + '\"]';
        });
      })));
    } catch (e) {
      console.error("QUERY_SELECTOR_ENGINE error", node, selector);
    }
  };

  var MATCHES_SELECTOR_ENGINE = function MATCHES_SELECTOR_ENGINE(node, selector) {
    return node[MATCHES_SELECTOR_NAME](selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function (s) {
      return s.replace(/\=.+\]$/, function (s) {
        return '=\"' + s.substr(1, s.length - 2) + '\"]';
      });
    }));
  };

  var nodeList = function nodeList(node, eq) {
    node = (0, _cast.asArray)(node).map(function (item) {
      return (0, _isLike.isNode)(item) ? item : undefined;
    });
    return typeof eq === "number" ? node[eq] : node;
  };

  _exports.nodeList = nodeList;

  var is = function is(node, selectText) {
    return !(0, _isLike.isNode)(node) ? false : typeof selectText === "undefined" || selectText == "*" || selectText == "" ? true : MATCHES_SELECTOR_ENGINE(node, selectText);
  };

  _exports.is = is;

  var query = function query(_query, root) {
    //querySelectorSupport
    if (typeof _query !== "string" || _query.trim().length == 0) return [];
    root = typeof root === "undefined" ? document : (0, _isLike.isNode)(root) ? root : document;
    return root == document ? QUERY_SELECTOR_ENGINE(root, _query) : MATCHES_SELECTOR_ENGINE(root, _query) ? [root].concat(Array.prototype.slice.call(QUERY_SELECTOR_ENGINE(root, _query))) : QUERY_SELECTOR_ENGINE(root, _query);
  };

  _exports.query = query;

  var toCSSQueryString = function toCSSQueryString(node, detail) {
    var t = nodeList(node, 0)[0];
    if (!t) return undefined;
    var tag = t.tagName.toLowerCase();
    var tid = tclass = tname = tattr = tvalue = '';
    N.propEach(N.NODEKIT.attr(t), function (value, sign) {
      switch (sign) {
        case "id":
          var id = t.getAttribute(sign);
          id.length && (tid = '#' + id);
          break;

        case "class":
          tclass = t.getAttribute(sign).trim().replace(/\s\s/g, ' ').split(' ').join('.');
          if (tclass) tclass = "." + tclass;
          break;

        case "name":
          tname = "[name=" + t.getAttribute(sign) + "]";
          break;

        case "value":
          break;

        default:
          if (detail == true) {
            attrValue = t.getAttribute(sign);
            tattr += attrValue == '' || attrValue == null ? "[" + sign + "]" : "[" + sign + "=" + attrValue + "]";
          }

          break;
      }
    });

    if (detail == true) {
      if (!/table|tbody|thead|tfoot|ul|ol/.test(tag)) {
        var tv = N.node.value(t);
        if (typeof tv !== undefined || tv !== null) if (typeof tv === 'string' && tv.length !== 0) tvalue = '::' + tv;
        if (typeof tvalue === 'string') tvalue = tvalue.trim();
      }
    }

    return tag + tid + tclass + tname + tattr + tvalue;
  };

  _exports.toCSSQueryString = toCSSQueryString;
});
//# sourceMappingURL=query-selector.js.map