(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.from", "core-js/modules/web.dom.iterable", "../../functions/functions", "../../functions/cast", "../../functions/isLike", "./query-selector"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.from"), require("core-js/modules/web.dom.iterable"), require("../../functions/functions"), require("../../functions/cast"), require("../../functions/isLike"), require("./query-selector"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.webDom, global.functions, global.cast, global.isLike, global.querySelector);
    global.finder = mod.exports;
  }
})(this, function (_exports, _es6Array, _webDom, _functions, _cast, _isLike, _querySelector) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.findMember = _exports.find = void 0;

  var findLite = function findLite(find) {
    if (typeof find === 'string') {
      // [string,null]
      return (0, _querySelector.query)(find);
    } else if ((0, _isLike.isNode)(find)) {
      // [node]
      return [find];
    } else if ((0, _isLike.isArray)(find)) {
      // [array]
      var fc = [];

      for (var i = 0, l = find.length; i < l; i++) {
        if (typeof find[i] === 'string') {
          // [array][string]
          var fs = (0, _querySelector.query)(find[i]);
          if (fs.length) fc = fc.concat(fs);
        } else if ((0, _isLike.isNode)(find[i])) {
          // [array][node]
          fc.push(find[i]);
        } else if ((0, _isLike.isArray)(find[i])) {
          var fa = findLite(find[i]);
          if (fa.length) fc = fc.concat(fa);
        }
      }

      return (0, _functions.unique)(fc);
    }

    return [];
  }; //여러개의 셀럭터와 하나의 루트노드만 허용


  var findByOnePlace = function findByOnePlace(findse, rootNode) {
    if (typeof findse === 'string') return (0, _querySelector.query)(findse, rootNode);

    if ((0, _isLike.isNode)(findse)) {
      var fs = (0, _querySelector.query)(N.node.trace(findse), rootNode);

      for (var i = 0, l = fs.length; i < l; i++) {
        if (findse === fs[i]) return [findse];
      }
    }

    if ((0, _isLike.isArray)(findse)) {
      var result = [];

      for (var i = 0, l = findse.length; i < l; i++) {
        var fd = findByOnePlace(findse[i], rootNode);
        if (fd.length) result = result.concat(fd);
      }

      return (0, _functions.unique)(result);
    }

    return [];
  }; //다수의 로트와 샐렉터를 받고 출력


  var findBySeveralPlaces = function findBySeveralPlaces(find, root) {
    if (arguments.length === 1 || typeof root === 'undefined' || root === null || root === W.document) return findLite(find); // find root

    var targetRoots = findLite(root);

    if (targetRoots.length === 0) {
      return findLite(find);
    } //


    var findes = (0, _cast.toArray)(find);
    var result = [];

    for (var i = 0, l = targetRoots.length; i < l; i++) {
      for (var fi = 0, fl = findes.length; fi < fl; fi++) {
        var fdr = findByOnePlace(findes[fi], targetRoots[i]);
        if (fdr.length) result = result.concat(fdr);
      }
    }

    return (0, _functions.unique)(result);
  }; //최적화 분기하여 샐랙터를 실행시킴


  var find = function find(_find, root, eq) {
    return typeof root === "number" ? findLite(_find)[root] : typeof eq === "number" ? findBySeveralPlaces(_find, root)[eq] : findBySeveralPlaces(_find, root);
  };

  _exports.find = find;

  var findMember = function findMember(sel, offset) {
    var target = findLite(sel)[0];
    if (!(0, _isLike.isNode)(target)) return;
    if (typeof offset !== "number") return (0, _cast.toArray)(target.parentElement.children);
    var currentIndex = -1;
    Array.from(target.parentNode.children).forEach(function (node, i) {
      if (target == node) {
        currentIndex = i;
        return false;
      }
    });
    return target.parentNode.children[currentIndex + offset];
  };

  _exports.findMember = findMember;

  var getCurrentTarget = function getCurrentTarget(originalEvent, fallbackElement) {
    var result = originalEvent.currentTarget || originalEvent.target;
    return result && result.documentElement ? fallbackElement || result.documentElement : document.documentElement;
  };

  var isElementEvent = function isElementEvent(e) {
    return typeof e.stopPropagation === "function";
  };

  var getElementPosition = function getElementPosition(el) {
    var element = find(el, 0);
    if (!element) return null;
    var xPosition = 0;
    var yPosition = 0;

    while (element && !element.documentElement) {
      xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
      yPosition += element.offsetTop - element.scrollTop + element.clientTop;
      element = element.offsetParent;
    }

    return {
      x: xPosition,
      y: yPosition
    };
  };

  var getPointerPosition = $.getPointerPosition = function (e, root) {
    root = !root ? document.documentElement : root;
    var pos = getElementPosition(root);
    if (!pos) return;
    pos.x = (e.touches ? e.targetTouches[0].pageX : e.pageX) - pos.x;
    pos.y = (e.touches ? e.targetTouches[0].pageY : e.pageY) - pos.y;
    return pos;
  };
});
//# sourceMappingURL=finder.js.map