(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.module = factory());
}(this, (function () { 'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function step(key, arg) {
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

        function _next(value) {
          step("next", value);
        }

        function _throw(err) {
          step("throw", err);
        }

        _next();
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

  var _isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _anObject = function (it) {
    if (!_isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function () {
    return Object.defineProperty({}, 'a', {
      get: function get() {
        return 7;
      }
    }).a != 7;
  });

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
  : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var document$1 = _global.document; // typeof document.createElement is 'object' in old IE


  var is = _isObject(document$1) && _isObject(document$1.createElement);

  var _domCreate = function (it) {
    return is ? document$1.createElement(it) : {};
  };

  var _ie8DomDefine = !_descriptors && !_fails(function () {
    return Object.defineProperty(_domCreate('div'), 'a', {
      get: function get() {
        return 7;
      }
    }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])
   // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string


  var _toPrimitive = function (it, S) {
    if (!_isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;
  var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject(O);
    P = _toPrimitive(P, true);
    _anObject(Attributes);
    if (_ie8DomDefine) try {
      return dP(O, P, Attributes);
    } catch (e) {
      /* empty */
    }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp = {
  	f: f
  };

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  // @@replace logic
  _fixReWks('replace', 2, function (defined, REPLACE, $replace) {
    // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
    return [function replace(searchValue, replaceValue) {

      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
    }, $replace];
  });

  // @@split logic
  require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {

    var isRegExp = require('./_is-regexp');

    var _split = $split;
    var $push = [].push;
    var $SPLIT = 'split';
    var LENGTH = 'length';
    var LAST_INDEX = 'lastIndex';

    if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
      var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
      // based on es5-shim implementation, need to rework it

      $split = function $split(separator, limit) {
        var string = String(this);
        if (separator === undefined && limit === 0) return []; // If `separator` is not a regex, use native split

        if (!isRegExp(separator)) return _split.call(string, separator, limit);
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        var splitLimit = limit === undefined ? 4294967295 : limit >>> 0; // Make `global` and avoid `lastIndex` issues by working with a copy

        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var separator2, match, lastIndex, lastLength, i; // Doesn't need flags gy, but they don't hurt

        if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);

        while (match = separatorCopy.exec(string)) {
          // `separatorCopy.lastIndex` is not reliable cross-browser
          lastIndex = match.index + match[0][LENGTH];

          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index)); // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
            // eslint-disable-next-line no-loop-func

            if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
              for (i = 1; i < arguments[LENGTH] - 2; i++) {
                if (arguments[i] === undefined) match[i] = undefined;
              }
            });
            if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
            lastLength = match[0][LENGTH];
            lastLastIndex = lastIndex;
            if (output[LENGTH] >= splitLimit) break;
          }

          if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
        }

        if (lastLastIndex === string[LENGTH]) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));

        return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
      }; // Chakra, V8

    } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
      $split = function $split(separator, limit) {
        return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
      };
    } // 21.1.3.17 String.prototype.split(separator, limit)


    return [function split(separator, limit) {
      var O = defined(this);
      var fn = separator == undefined ? undefined : separator[SPLIT];
      return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
    }, $split];
  });

  var global$1 = require('./_global');

  var hide = require('./_hide');

  var has = require('./_has');

  var SRC = require('./_uid')('src');

  var TO_STRING = 'toString';
  var $toString = Function[TO_STRING];
  var TPL = ('' + $toString).split(TO_STRING);

  require('./_core').inspectSource = function (it) {
    return $toString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) has(val, 'name') || hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));

    if (O === global$1) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      hide(O, key, val);
    } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative

  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });

  var redefine = /*#__PURE__*/Object.freeze({

  });

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  var store = require('./_shared')('wks');

  var uid = require('./_uid');

  var Symbol$1 = require('./_global').Symbol;

  var USE_SYMBOL = typeof Symbol$1 == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] = USE_SYMBOL && Symbol$1[name] || (USE_SYMBOL ? Symbol$1 : uid)('Symbol.' + name));
  };

  $exports.store = store;

  var wks = /*#__PURE__*/Object.freeze({

  });

  var _fixReWks = function (KEY, length, exec) {
    var SYMBOL = wks(KEY);
    var fns = exec(_defined, SYMBOL, ''[KEY]);
    var strfn = fns[0];
    var rxfn = fns[1];

    if (_fails(function () {
      var O = {};

      O[SYMBOL] = function () {
        return 7;
      };

      return ''[KEY](O) != 7;
    })) {
      redefine(String.prototype, KEY, strfn);
      _hide(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) {
        return rxfn.call(string, this, arg);
      } // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) {
        return rxfn.call(string, this);
      });
    }
  };

  // @@match logic
  _fixReWks('match', 1, function (defined, MATCH, $match) {
    // 21.1.3.11 String.prototype.match(regexp)
    return [function match(regexp) {

      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    }, $match];
  });

  var dP$1 = require('./_object-dp').f;

  var FProto = Function.prototype;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name'; // 19.2.4.2 name

  NAME in FProto || require('./_descriptors') && dP$1(FProto, NAME, {
    configurable: true,
    get: function get() {
      try {
        return ('' + this).match(nameRE)[1];
      } catch (e) {
        return '';
      }
    }
  });

  var global$2 = require('./_global');

  var core = require('./_core');

  var hide$1 = require('./_hide');

  var redefine$1 = require('./_redefine');

  var ctx = require('./_ctx');

  var PROTOTYPE = 'prototype';

  var $export = function $export(type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var target = IS_GLOBAL ? global$2 : IS_STATIC ? global$2[name] || (global$2[name] = {}) : (global$2[name] || {})[PROTOTYPE];
    var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;

    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined; // export native or passed

      out = (own ? target : source)[key]; // bind timers to global for call from export context

      exp = IS_BIND && own ? ctx(out, global$2) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out; // extend global

      if (target) redefine$1(target, key, out, type & $export.U); // export

      if (exports[key] != out) hide$1(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };

  global$2.core = core; // type bitmap

  $export.F = 1; // forced

  $export.G = 2; // global

  $export.S = 4; // static

  $export.P = 8; // proto

  $export.B = 16; // bind

  $export.W = 32; // wrap

  $export.U = 64; // safe

  $export.R = 128; // real proto method for `library`

  module.exports = $export;

  var $export$1 = /*#__PURE__*/Object.freeze({

  });

  var global$3 = require('./_global');

  var has$1 = require('./_has');

  var DESCRIPTORS = require('./_descriptors');

  var $export$2 = require('./_export');

  var redefine$2 = require('./_redefine');

  var META = require('./_meta').KEY;

  var $fails = require('./_fails');

  var shared = require('./_shared');

  var setToStringTag = require('./_set-to-string-tag');

  var uid$1 = require('./_uid');

  var wks$1 = require('./_wks');

  var wksExt = require('./_wks-ext');

  var wksDefine = require('./_wks-define');

  var enumKeys = require('./_enum-keys');

  var isArray = require('./_is-array');

  var anObject = require('./_an-object');

  var isObject = require('./_is-object');

  var toIObject = require('./_to-iobject');

  var toPrimitive = require('./_to-primitive');

  var createDesc = require('./_property-desc');

  var _create = require('./_object-create');

  var gOPNExt = require('./_object-gopn-ext');

  var $GOPD = require('./_object-gopd');

  var $DP = require('./_object-dp');

  var $keys = require('./_object-keys');

  var gOPD = $GOPD.f;
  var dP$2 = $DP.f;
  var gOPN = gOPNExt.f;
  var $Symbol = global$3.Symbol;
  var $JSON = global$3.JSON;

  var _stringify = $JSON && $JSON.stringify;

  var PROTOTYPE$1 = 'prototype';
  var HIDDEN = wks$1('_hidden');
  var TO_PRIMITIVE = wks$1('toPrimitive');
  var isEnum = {}.propertyIsEnumerable;
  var SymbolRegistry = shared('symbol-registry');
  var AllSymbols = shared('symbols');
  var OPSymbols = shared('op-symbols');
  var ObjectProto = Object[PROTOTYPE$1];
  var USE_NATIVE = typeof $Symbol == 'function';
  var QObject = global$3.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

  var setter = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

  var setSymbolDesc = DESCRIPTORS && $fails(function () {
    return _create(dP$2({}, 'a', {
      get: function get() {
        return dP$2(this, 'a', {
          value: 7
        }).a;
      }
    })).a != 7;
  }) ? function (it, key, D) {
    var protoDesc = gOPD(ObjectProto, key);
    if (protoDesc) delete ObjectProto[key];
    dP$2(it, key, D);
    if (protoDesc && it !== ObjectProto) dP$2(ObjectProto, key, protoDesc);
  } : dP$2;

  var wrap = function wrap(tag) {
    var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE$1]);

    sym._k = tag;
    return sym;
  };

  var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return it instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
    anObject(it);
    key = toPrimitive(key, true);
    anObject(D);

    if (has$1(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!has$1(it, HIDDEN)) dP$2(it, HIDDEN, createDesc(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (has$1(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
        D = _create(D, {
          enumerable: createDesc(0, false)
        });
      }

      return setSymbolDesc(it, key, D);
    }

    return dP$2(it, key, D);
  };

  var $defineProperties = function defineProperties(it, P) {
    anObject(it);
    var keys = enumKeys(P = toIObject(P));
    var i = 0;
    var l = keys.length;
    var key;

    while (l > i) {
      $defineProperty(it, key = keys[i++], P[key]);
    }

    return it;
  };

  var $create = function create(it, P) {
    return P === undefined ? _create(it) : $defineProperties(_create(it), P);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = isEnum.call(this, key = toPrimitive(key, true));
    if (this === ObjectProto && has$1(AllSymbols, key) && !has$1(OPSymbols, key)) return false;
    return E || !has$1(this, key) || !has$1(AllSymbols, key) || has$1(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    it = toIObject(it);
    key = toPrimitive(key, true);
    if (it === ObjectProto && has$1(AllSymbols, key) && !has$1(OPSymbols, key)) return;
    var D = gOPD(it, key);
    if (D && has$1(AllSymbols, key) && !(has$1(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
    return D;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = gOPN(toIObject(it));
    var result = [];
    var i = 0;
    var key;

    while (names.length > i) {
      if (!has$1(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
    }

    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectProto;
    var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
    var result = [];
    var i = 0;
    var key;

    while (names.length > i) {
      if (has$1(AllSymbols, key = names[i++]) && (IS_OP ? has$1(ObjectProto, key) : true)) result.push(AllSymbols[key]);
    }

    return result;
  }; // 19.4.1.1 Symbol([description])


  if (!USE_NATIVE) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
      var tag = uid$1(arguments.length > 0 ? arguments[0] : undefined);

      var $set = function $set(value) {
        if (this === ObjectProto) $set.call(OPSymbols, value);
        if (has$1(this, HIDDEN) && has$1(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDesc(this, tag, createDesc(1, value));
      };

      if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {
        configurable: true,
        set: $set
      });
      return wrap(tag);
    };

    redefine$2($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return this._k;
    });
    $GOPD.f = $getOwnPropertyDescriptor;
    $DP.f = $defineProperty;
    require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
    require('./_object-pie').f = $propertyIsEnumerable;
    require('./_object-gops').f = $getOwnPropertySymbols;

    if (DESCRIPTORS && !require('./_library')) {
      redefine$2(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }

    wksExt.f = function (name) {
      return wrap(wks$1(name));
    };
  }

  $export$2($export$2.G + $export$2.W + $export$2.F * !USE_NATIVE, {
    Symbol: $Symbol
  });

  for (var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
    wks$1(es6Symbols[j++]);
  }

  for (var wellKnownSymbols = $keys(wks$1.store), k = 0; wellKnownSymbols.length > k;) {
    wksDefine(wellKnownSymbols[k++]);
  }

  $export$2($export$2.S + $export$2.F * !USE_NATIVE, 'Symbol', {
    // 19.4.2.1 Symbol.for(key)
    'for': function _for(key) {
      return has$1(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
    },
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');

      for (var key in SymbolRegistry) {
        if (SymbolRegistry[key] === sym) return key;
      }
    },
    useSetter: function useSetter() {
      setter = true;
    },
    useSimple: function useSimple() {
      setter = false;
    }
  });
  $export$2($export$2.S + $export$2.F * !USE_NATIVE, 'Object', {
    // 19.1.2.2 Object.create(O [, Properties])
    create: $create,
    // 19.1.2.4 Object.defineProperty(O, P, Attributes)
    defineProperty: $defineProperty,
    // 19.1.2.3 Object.defineProperties(O, Properties)
    defineProperties: $defineProperties,
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: $getOwnPropertyNames,
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: $getOwnPropertySymbols
  }); // 24.3.2 JSON.stringify(value [, replacer [, space]])

  $JSON && $export$2($export$2.S + $export$2.F * (!USE_NATIVE || $fails(function () {
    var S = $Symbol(); // MS Edge converts symbol values to JSON as {}
    // WebKit converts symbol values to JSON as null
    // V8 throws on boxed symbols

    return _stringify([S]) != '[null]' || _stringify({
      a: S
    }) != '{}' || _stringify(Object(S)) != '{}';
  })), 'JSON', {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;

      while (arguments.length > i) {
        args.push(arguments[i++]);
      }

      $replacer = replacer = args[1];
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

      if (!isArray(replacer)) replacer = function replacer(key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return _stringify.apply($JSON, args);
    }
  }); // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)

  $Symbol[PROTOTYPE$1][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf); // 19.4.3.5 Symbol.prototype[@@toStringTag]

  setToStringTag($Symbol, 'Symbol'); // 20.2.1.9 Math[@@toStringTag]

  setToStringTag(Math, 'Math', true); // 24.3.3 JSON[@@toStringTag]

  setToStringTag(global$3.JSON, 'JSON', true);

  var getKeys = require('./_object-keys');

  var gOPS = require('./_object-gops');

  var pIE = require('./_object-pie');

  var toObject = require('./_to-object');

  var IObject = require('./_iobject');

  var $assign = Object.assign; // should work with symbols and should have deterministic property order (V8 bug)

  module.exports = !$assign || require('./_fails')(function () {
    var A = {};
    var B = {}; // eslint-disable-next-line no-undef

    var S = Symbol();
    var K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function (k) {
      B[k] = k;
    });
    return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars
    var T = toObject(target);
    var aLen = arguments.length;
    var index = 1;
    var getSymbols = gOPS.f;
    var isEnum = pIE.f;

    while (aLen > index) {
      var S = IObject(arguments[index++]);
      var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
      var length = keys.length;
      var j = 0;
      var key;

      while (length > j) {
        if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
      }
    }

    return T;
  } : $assign;

  var _objectAssign = /*#__PURE__*/Object.freeze({

  });

  // 19.1.3.1 Object.assign(target, source)


  $export$1($export$1.S + $export$1.F, 'Object', {
    assign: _objectAssign
  });

  // @@search logic
  _fixReWks('search', 1, function (defined, SEARCH, $search) {
    // 21.1.3.15 String.prototype.search(regexp)
    return [function search(regexp) {

      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    }, $search];
  });

  var isAbsoluteNaN = function isAbsoluteNaN(number) {
    return number !== number && typeof number === "number";
  };
  var isNone = function isNone(data) {
    return isAbsoluteNaN(data) || data === undefined || data === null;
  };
  var isNumber = function isNumber() {
    return typeof num === "number" && !isAbsoluteNaN(num);
  };
  var isInteger = function isInteger(value) {
    //NaN, null, undefined
    if (isNone(value) === true) return false;

    if (typeof value === "string") {
      value = value.trim();
    }

    if (!/string|number/.test(typeof value) || value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY || isNaN(value)) {
      return false;
    }

    return value == parseInt(value, 10);
  };
  var isArray$1 = function isArray(data) {
    return Array.isArray(data) || data instanceof Array;
  };
  var isObject$1 = function isObject(object) {
    return object !== null && typeof object === "object" ? true : false;
  };
  var isFunction = function isFunction(f) {
    return typeof f === "function";
  };
  var likeString = function likeString(data) {
    if (typeof data === "string") return true;
    if (isNumber(data)) return true;
    return false;
  };
  var likeNumber = function likeNumber(data) {
    if (isNumber(data)) return true;
    if (typeof data === "string") return String(parseFloat(t)) === String(t);
    return false;
  };
  var likeArray = function (nodeFn, webFn) {
    var definedNodeList;

    try {
      definedNodeList = 0 instanceof NodeList;
      definedNodeList = true;
    } catch (e) {
      definedNodeList = false;
    }

    return definedNodeList ? webFn : nodeFn;
  }( //nodeFn
  function (data) {
    return isArray$1(data);
  }, //webFn
  function (data) {
    return isArray$1(data) || data instanceof NodeList;
  }); //TODO : native isPlainObject

  var isNode = function isNode(a) {
    return isObject$1(a) && typeof a.nodeType === "number";
  };
  var isEmpty = function isEmpty() {
    if (typeof o === "undefined") return true;
    if (typeof o === "string") return o.trim().length < 1 ? true : false;

    if (typeof o === "object") {
      if (o == null) return true;
      if (o instanceof RegExp) return false;

      if (isArray$1(o)) {
        return !o.length;
      } else {
        for (var prop in o) {
          return false;
        }

        return true;
      }
    }

    if (typeof o === "number") return false;
    if (typeof o === "function") return false;
    if (typeof o === "boolean") return false;
    return true;
  };
  var likeRegexp = function likeRegexp(s) {
    return typeof s === "string" || s instanceof RegExp;
  };
  var isPlainObject = function isPlainObject(data) {
    if (typeof data !== "object") {
      return false;
    }

    if (isArray$1(data)) {
      return false;
    }

    if (Object.prototype.toString.call(data) === '[object Object]') {
      return true;
    }

    if (typeof o.constructor === "function") {
      return false;
    }

    if (data.prototype.hasOwnProperty('isPrototypeOf') === false) {
      return false;
    }

    return true;
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

  var $export$3 = require('./_export');

  var $find = require('./_array-methods')(6);

  var KEY = 'findIndex';
  var forced = true; // Shouldn't skip holes

  if (KEY in []) Array(1)[KEY](function () {
    forced = false;
  });
  $export$3($export$3.P + $export$3.F * forced, 'Array', {
    findIndex: function findIndex(callbackfn
    /* , that = undefined */
    ) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  require('./_add-to-unscopables')(KEY);

  var asArray$1 = function asArray(data, defaultArray) {
    if (defaultArray === void 0) {
      defaultArray = undefined;
    }

    if (isArray$1(data)) {
      return data;
    }

    if (isNone(data)) {
      return isArray$1(defaultArray) ? defaultArray : isNone(defaultArray) ? [] : [defaultArray];
    }

    if (typeof data === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }

    return [data];
  };
  var toArray = function toArray(data, option) {
    if (typeof data === "undefined" || data === null || data === NaN) return [];
    if (isArray$1(data)) return Array.prototype.slice.call(data);
    if (typeof data === "object" && typeof data.toArray === "function") return data.toArray();
    if (typeof option === "string") return data.split(option);
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
        var r = v.replace(/[^.\d\-]/g, "") * 1;
        return isAbsoluteNaN(r) ? 0 : r;
        break;
    }

    switch (typeof d) {
      case "number":
        return d;

      case "string":
        var r = d * 1;
        return isAbsoluteNaN(r) ? 0 : r;
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

        if (isArray$1(target)) {
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
    var d;

    if (typeof target === "object") {
      if (isArray$1(target)) {
        if (!isArray$1(d)) {
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
      clone(target);
    }
  };
  var free = function free(datum) {
    var dest = {};
    Object.keys(datum).forEach(function (key) {
      if (!/^\$/.test(key)) {
        dest[key] = _cloneDeep(datum[key]);
      }
    });
    return dest;
  };

  var getKeyWithValue = function getKeyWithValue(obj, value) {
    if (isArray$1(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (obj[i] === value) return i;
      }
    }

    if (isObject$1(obj)) {
      for (var key in obj) {
        if (obj[key] === value) return key;
      }
    }

    return undefined;
  };

  var removeValue = function removeValue(obj, value) {
    var detect = true;
    var array = isArray$1(obj);

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
  var alloc$1 = function alloc(init) {
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

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject$2(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject$2;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */

  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
  }

  var _isPrototype = isPrototype;

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }

  var _overArg = overArg;

  /* Built-in method references for those with the same name as other `lodash` methods. */


  var nativeKeys = _overArg(Object.keys, Object);
  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */


  var objectProto$1 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto$1.hasOwnProperty;
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */

  function baseKeys(object) {
    if (!_isPrototype(object)) {
      return _nativeKeys(object);
    }

    var result = [];

    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }

  var _baseKeys = baseKeys;

  var isFunction$1 = require('./isFunction'),
      isMasked = require('./_isMasked'),
      isObject$3 = require('./isObject'),
      toSource = require('./_toSource');
  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */


  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Used for built-in method references. */

  var funcProto = Function.prototype,
      objectProto$2 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */

  function baseIsNative(value) {
    if (!isObject$3(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  module.exports = baseIsNative;

  var _baseIsNative = /*#__PURE__*/Object.freeze({

  });

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */


  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */


  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = _freeGlobal || freeSelf || Function('return this')();
  var _root = root;

  /* Built-in method references that are verified to be native. */


  var DataView = _getNative(_root, 'DataView');
  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */


  var Map$1 = _getNative(_root, 'Map');
  var _Map = Map$1;

  /* Built-in method references that are verified to be native. */


  var Promise$1 = _getNative(_root, 'Promise');
  var _Promise = Promise$1;

  /* Built-in method references that are verified to be native. */


  var Set = _getNative(_root, 'Set');
  var _Set = Set;

  /* Built-in method references that are verified to be native. */


  var WeakMap = _getNative(_root, 'WeakMap');
  var _WeakMap = WeakMap;

  /** Built-in value references. */


  var Symbol$2 = _root.Symbol;
  var _Symbol = Symbol$2;

  /** Used for built-in method references. */


  var objectProto$3 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto$3.toString;
  /** Built-in value references. */

  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */

  function getRawTag(value) {
    var isOwn = hasOwnProperty$2.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);

    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }

    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$4.toString;
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */

  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */


  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';
  /** Built-in value references. */

  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }

    return symToStringTag$1 && symToStringTag$1 in Object(value) ? _getRawTag(value) : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$1 = funcProto$1.toString;
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */

  function toSource$1(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }

  var _toSource = toSource$1;

  /** `Object#toString` result references. */


  var mapTag = '[object Map]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      setTag = '[object Set]',
      weakMapTag = '[object WeakMap]';
  var dataViewTag = '[object DataView]';
  /** Used to detect maps, sets, and weakmaps. */

  var dataViewCtorString = _toSource(_DataView),
      mapCtorString = _toSource(_Map),
      promiseCtorString = _toSource(_Promise),
      setCtorString = _toSource(_Set),
      weakMapCtorString = _toSource(_WeakMap);
  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  var getTag = _baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

  if (_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag || _Map && getTag(new _Map()) != mapTag || _Promise && getTag(_Promise.resolve()) != promiseTag || _Set && getTag(new _Set()) != setTag || _WeakMap && getTag(new _WeakMap()) != weakMapTag) {
    getTag = function getTag(value) {
      var result = _baseGetTag(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;

          case mapCtorString:
            return mapTag;

          case promiseCtorString:
            return promiseTag;

          case setCtorString:
            return setTag;

          case weakMapCtorString:
            return weakMapTag;
        }
      }

      return result;
    };
  }

  var _getTag = getTag;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */


  var argsTag = '[object Arguments]';
  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */

  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */


  var objectProto$5 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$3 = objectProto$5.hasOwnProperty;
  /** Built-in value references. */

  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */

  var isArguments = _baseIsArguments(function () {
    return arguments;
  }()) ? _baseIsArguments : function (value) {
    return isObjectLike_1(value) && hasOwnProperty$3.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  };
  var isArguments_1 = isArguments;

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray$2 = Array.isArray;
  var isArray_1 = isArray$2;

  /** `Object#toString` result references. */


  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */

  function isFunction$2(value) {
    if (!isObject_1(value)) {
      return false;
    } // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.


    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction$2;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */

  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  var isLength_1 = isLength;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */


  function isArrayLike(value) {
    return value != null && isLength_1(value.length) && !isFunction_1(value);
  }

  var isArrayLike_1 = isArrayLike;

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  var stubFalse_1 = stubFalse;

  var isBuffer_1 = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */


  var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Built-in value references. */

  var Buffer = moduleExports ? _root.Buffer : undefined;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */

  var isBuffer = nativeIsBuffer || stubFalse_1;
  module.exports = isBuffer;
  });

  /** `Object#toString` result references. */


  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag$1 = '[object Map]',
      numberTag = '[object Number]',
      objectTag$1 = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag$1 = '[object Set]',
      stringTag = '[object String]',
      weakMapTag$1 = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag$1 = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';
  /** Used to identify `toStringTag` values of typed arrays. */

  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag$1] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag$1] = false;
  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */

  function baseIsTypedArray(value) {
    return isObjectLike_1(value) && isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
  }

  var _baseIsTypedArray = baseIsTypedArray;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary;

  var _nodeUtil = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */


  var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Detect free variable `process` from Node.js. */

  var freeProcess = moduleExports && _freeGlobal.process;
  /** Used to access faster Node.js helpers. */

  var nodeUtil = function () {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }();

  module.exports = nodeUtil;
  });

  /* Node.js helper references. */


  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;
  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */

  var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;
  var isTypedArray_1 = isTypedArray;

  /** `Object#toString` result references. */


  var mapTag$2 = '[object Map]',
      setTag$2 = '[object Set]';
  /** Used for built-in method references. */

  var objectProto$6 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;
  /**
   * Checks if `value` is an empty object, collection, map, or set.
   *
   * Objects are considered empty if they have no own enumerable string keyed
   * properties.
   *
   * Array-like values such as `arguments` objects, arrays, buffers, strings, or
   * jQuery-like collections are considered empty if they have a `length` of `0`.
   * Similarly, maps and sets are considered empty if they have a `size` of `0`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty(null);
   * // => true
   *
   * _.isEmpty(true);
   * // => true
   *
   * _.isEmpty(1);
   * // => true
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({ 'a': 1 });
   * // => false
   */

  function isEmpty$1(value) {
    if (value == null) {
      return true;
    }

    if (isArrayLike_1(value) && (isArray_1(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer_1(value) || isTypedArray_1(value) || isArguments_1(value))) {
      return !value.length;
    }

    var tag = _getTag(value);

    if (tag == mapTag$2 || tag == setTag$2) {
      return !value.size;
    }

    if (_isPrototype(value)) {
      return !_baseKeys(value).length;
    }

    for (var key in value) {
      if (hasOwnProperty$4.call(value, key)) {
        return false;
      }
    }

    return true;
  }

  var isEmpty_1 = isEmpty$1;

  /** `Object#toString` result references. */


  var symbolTag = '[object Symbol]';
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */

  function isSymbol$1(value) {
    return typeof value == 'symbol' || isObjectLike_1(value) && _baseGetTag(value) == symbolTag;
  }

  var isSymbol_1 = isSymbol$1;

  /** Used to match property names within property paths. */


  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;
  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */

  function isKey(value, object) {
    if (isArray_1(value)) {
      return false;
    }

    var type = typeof value;

    if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol_1(value)) {
      return true;
    }

    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }

  var _isKey = isKey;

  var memoizeCapped = require('./_memoizeCapped');
  /** Used to match property names within property paths. */


  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  /** Used to match backslashes in property paths. */

  var reEscapeChar = /\\(\\)?/g;
  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */

  var stringToPath = memoizeCapped(function (string) {
    var result = [];

    if (string.charCodeAt(0) === 46
    /* . */
    ) {
        result.push('');
      }

    string.replace(rePropName, function (match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
    });
    return result;
  });
  module.exports = stringToPath;

  var _stringToPath = /*#__PURE__*/Object.freeze({

  });

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }

    return result;
  }

  var _arrayMap = arrayMap;

  /** Used as references for various `Number` constants. */


  var INFINITY = 1 / 0;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;
  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */

  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    if (isArray_1(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return _arrayMap(value, baseToString) + '';
    }

    if (isSymbol_1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }

  var _baseToString = baseToString;

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */


  function toString(value) {
    return value == null ? '' : _baseToString(value);
  }

  var toString_1 = toString;

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */


  function castPath(value, object) {
    if (isArray_1(value)) {
      return value;
    }

    return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
  }

  var _castPath = castPath;

  /** Used as references for various `Number` constants. */


  var INFINITY$1 = 1 / 0;
  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */

  function toKey(value) {
    if (typeof value == 'string' || isSymbol_1(value)) {
      return value;
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
  }

  var _toKey = toKey;

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */


  function baseGet(object, path) {
    path = _castPath(path, object);
    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[_toKey(path[index++])];
    }

    return index && index == length ? object : undefined;
  }

  var _baseGet = baseGet;

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */


  function get(object, path, defaultValue) {
    var result = object == null ? undefined : _baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  var get_1 = get;

  var get$1 = function get(target, path) {
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
  var hasProperty = function hasProperty(obj, value, key) {
    if (arguments.length == 1 && isObject_1(obj)) return isEmpty_1(obj);
    if (isArray_1(obj)) for (var i = 0, l = obj.length; i < l; i++) {
      if (obj[i] === value) return true;
    }

    if (isObject_1(obj)) {
      if (key) {
        return get_1(obj, key) === value;
      } else {
        for (var key in obj) {
          if (get_1(obj, key) === value) return true;
        }
      }
    }

    return false;
  };
  var turn$1 = function turn(i, p, ts) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = p - (abs > p ? abs % p : abs);
    }

    ts = ts || 1;
    i = Math.floor(i / ts);
    return p > i ? i : i % p;
  };
  var max = function max(numberList) {
    var result;
    asArray$1(numberList).forEach(function (n) {
      if (isNumber(n)) {
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

  var FUNCTION_EXPORTS = {};

  var UNIQUE = FUNCTION_EXPORTS.UNIQUE = function (array) {
    var result = [],
        array = toArray(array);

    for (var i = 0, l = array.length; i < l; i++) {
      var unique = true;

      for (var i2 = 0, l2 = result.length; i2 < l2; i2++) {
        if (array[i] == result[i2]) {
          unique = false;
          break;
        }
      }

      if (unique == true) result.push(array[i]);
    }

    return result;
  };

  var HAS_VALUE = FUNCTION_EXPORTS.HAS_VALUE = function () {
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
        return (useLeftSelector ? get$1(object, leftSelect) : object) === (useRightSelector ? get$1(value, rightSelect) : value);
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
      } else if (isObject$1(obj)) {
        if (value === void 0 && key === void 0) return !isEmpty(obj);
        var proc;

        if (key) {
          if (typeof key === "function") {
            proc = functionKeyObjectValueProc(key);
          } else if (isArray$1(key) && key.length > 1) {
            proc = selectKeyObjectValueProc(key[0], key[1]);
          } else if (typeof key === "string" || typeof key === "number") {
            proc = selectKeyObjectValueProc(key, key);
          }
        } else {
          proc = defaultObjectValueFunc;
        }

        if (isArray$1(obj)) {
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

  var GET_KEY_BY = FUNCTION_EXPORTS.GET_KEY_BY = function (object, value) {
    if (isFunction(value)) {
      if (isArray$1(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (value(object[i], i) === true) return i;
      }
      if (isObject$1(object)) for (var key in object) {
        if (value(object[key], key) === true) return key;
      }
    } else {
      if (isArray$1(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (object[i] === value) return i;
      }
      if (isObject$1(object)) for (var key in object) {
        if (object[key] === value) return key;
      }
    }
  };

  var STRING_CAST = FUNCTION_EXPORTS.STRING_CAST = function () {
    return function (text, defaultOrder, finder, at) {
      if (typeof text === "string" || typeof text === "number") {
        var idxs = [];
        var hist = [];
        var count = 0;
        var pin = !at || !isNumber(at) || at < 0 ? 0 : at;
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

            if (likeRegexp(nextOrder)) {
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
  }();
  /*
    bow.findIndexes("hello world","l") [2,3,9]
    bow.findIndexes("hello world",/l/) [2,3,9]
    bow.findIndexes("hello world",/\s/) [5]
  */


  var FIND_INDEXES = FUNCTION_EXPORTS.FIND_INDEXES = function () {
    var __find_string = function __find_string(c, s, p) {
      return c.indexOf(s, p);
    };

    var __find_regexp = function __find_regexp(c, s, p) {
      var i = c.substring(p || 0).search(s);
      return i >= 0 ? i + (p || 0) : i;
    };

    return function (c, s, at) {
      if (typeof c === "string" || typeof c === "number") {
        var idxs = [],
            s = likeRegexp(s) ? s : s + "",
            at = !at || !isNumber(at) || at < 0 ? 0 : at,
            __find = s instanceof RegExp ? __find_regexp : __find_string,
            next;

        do {
          var i = __find(c, s, at);

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

  var EACH_PROC = FUNCTION_EXPORTS.EACH_PROC = function (arr, proc) {
    if (arr.length > 1) {
      for (var i = 0, l = arr.length - 1; i < l; proc(arr[i], i, false), i++) {
      }

      proc(arr[arr.length - 1], arr.length - 1, true);
    } else if (arr.length == 1) {
      proc(arr[0], 0, true);
    }

    return arr;
  };

  var STATIC_FOR_EACH_PROC = FUNCTION_EXPORTS.STATIC_FOR_EACH_PROC = function (obj, proc) {
    if (typeof obj === "object") for (var i = 0, a = obj instanceof Array, al = a ? obj.length : NaN, keys = Object.keys(obj), l = keys.length; i < l; proc(obj[keys[i]], keys[i], i, l, al), i++) {
    }
    return obj;
  };

  var EACH = function EACH(value, proc) {
    return EACH_PROC(asArray$1(value), proc);
  };

  var REDUCE = function REDUCE(value, proc, meta) {
    value = asArray$1(value);
    return EACH_PROC(value, function (v, i, l) {
      meta = proc(meta, v, i, l);
    }), meta;
  };

  var CLEAR_OF = FUNCTION_EXPORTS.CLEAR_OF = function (data, fillFn, sp) {
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

  var INSERT_OF = FUNCTION_EXPORTS.INSERT_OF = function (data, v, a) {
    isArray$1(data) && data.splice(typeof a === "number" ? a : 0, 0, v);
    return data;
  };

  var MOVE_OF = FUNCTION_EXPORTS.MOVE_OF = function (data, oldIndex, newIndex) {
    if (oldIndex !== newIndex && isArray$1(data) && typeof oldIndex === "number" && typeof newIndex === "number" && oldIndex >= 0 && oldIndex < data.length) {
      Array.prototype.splice.call(data, newIndex > data.length ? data.length : newIndex, 0, Array.prototype.splice.call(data, oldIndex, 1)[0]);
    }

    return data;
  };

  var CONCAT_OF = FUNCTION_EXPORTS.CONCAT_OF = function (data, appends) {
    var data = asArray$1(data);
    return EACH(appends, function (value) {
      data.push(value);
    }), data;
  };

  var FILTER_OF = FUNCTION_EXPORTS.FILTER_OF = function (data, func, exitFn) {
    var data = asArray$1(data);
    var exitCnt = 0;

    for (var i = 0, ri = 0, keys = Object.keys(data), l = keys.length; i < l; i++, ri++) {
      var key = keys[i];
      var value = data[key];
      var result = func(value, key);

      if (result == false) {
        var exit = Array.prototype.splice.call(data, i, 1);
        i--;
        l--;
        typeof exitFn === "function" && exitFn(value, ri, exitCnt++);
      }
    }

    return data;
  };

  var SORT_OF = FUNCTION_EXPORTS.SORT_OF = function (data, filter) {
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
          INSERT_OF(result, data[i], ri);
          break;
        }

        if (ri + 1 === result.length) {
          result.push(data[i]);
        }
      }
    }

    CLEAR_OF(data);

    for (var i = 0, l = result.length; i < l; data.push(result[i]), i++) {
    }

    return data;
  };

  var REBASE = FUNCTION_EXPORTS.REBASE = function (obj, ref) {
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
        EACH(key.split(","), function (deepKey) {
          deepKey = deepKey.trim();

          if (typeof obj[key] === "function") {
            result[deepKey] = obj[key];
          } else {
            if (!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object" || isNode(obj[key])) {
              result[deepKey] = obj[key];
            } else {
              result[deepKey] = Object.assign(result[deepKey] || (isArray$1(obj[key]) ? [] : {}), obj[key], obj[deepKey]);
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
  }; //TODO: Union HAS_VALUE


  var NESTED_HAS_PROC = FUNCTION_EXPORTS.NESTED_HAS_PROC = function (obj, key) {
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

  var APART = FUNCTION_EXPORTS.APART = function (text, split, block, blockEnd) {
    if (typeof text !== "string") return [text];
    var result = text.split(split === true ? /\s+/ : split || /\s+/);

    if (likeRegexp(block)) {
      if (!likeRegexp(blockEnd)) {
        blockEnd = block;
      }

      var aparts = [];

      for (var d = result, i = 0, l = d.length; i < l; i++) {
        var part = d[i];
        var greb = {
          start: FIND_INDEXES(part, block),
          end: FIND_INDEXES(part, blockEnd)
        };
        console.log("part, greb", part, greb);

        for (var _d = greb.start, _i = 0, _l = _d.length; _i < _l; ++_i) {
          var startIndex = _d[_i];
        }
      }

      return aparts;
    } else {
      return result;
    }
  };

  var DIFF_STRUCTURE = FUNCTION_EXPORTS.DIFF_STRUCTURE = function (before, after) {
    var afterKeys = Object.keys(after);
    var beforeKeys;
    var canDiff = false;

    if (isObject$1(before)) {
      if (isArray$1(before)) {
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
      keys: REDUCE(UNIQUE(afterKeys.concat(beforeKeys)), function (redu, key) {
        redu[key] = undefined;
        return redu;
      }, {}),
      match: [],
      missing: [],
      surplus: [],
      diff: [],
      pass: false
    }; //match, missing

    for (var ki in beforeKeys) {
      if (!beforeKeys.hasOwnProperty(ki)) continue;
      var key = beforeKeys[ki];

      if (NESTED_HAS_PROC(after, key)) {
        analysis.match.push(key);
        analysis.keys[key] = "match";

        if (canDiff && !angular.equals(get$1(after, key), get$1(before, key))) {
          analysis.diff.push(key);
          analysis.keys[key] = "diff";
        }
      } else {
        analysis.surplus.push(key);
        analysis.keys[key] = "surplus";
      }
    } //surplus


    EACH(afterKeys, function (key) {
      if (!HAS_VALUE(analysis.match, key)) {
        analysis.missing.push(key);
        analysis.keys[key] = "missing";
      }
    }); //absolute

    analysis.pass = !analysis.missing.length && !analysis.surplus.length;
    return analysis;
  }; //PINPONGPOOL INTERFACE


  var TOGGLE = FUNCTION_EXPORTS.TOGGLE = function (ta, cv, set) {
    var index = -1;

    for (var d = asArray$1(ta), _l2 = d.length, _i2 = 0; _i2 < _l2; _i2++) {
      if (d[_i2] == cv) {
        index = _i2 + 1;
        break;
      }
    }

    if (arguments.length > 2) for (var i = 0, l = ta.length; i < l; i++) {
      if (ta[i] == set) return ta[i];
    }
    index = ta.length == index ? 0 : index;
    return ta[index];
  };

  var TRUN = FUNCTION_EXPORTS.TRUN = function (i, p, ts) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = p - (abs > p ? abs % p : abs);
    }
    ts = ts ? ts : 1;
    i = Math.floor(i / ts);
    return p > i ? i : i % p;
  };

  var FINALLY_EXPORTS = Object.keys(FUNCTION_EXPORTS).reduce(function (dest, key) {
    var camelKey = key.toLowerCase().replace(/\_[\w]/g, function (s) {
      return s.substr(1).toUpperCase();
    });
    dest[camelKey] = FUNCTION_EXPORTS[key];
    return dest;
  }, {});
  module.exports = _objectSpread({}, FINALLY_EXPORTS);

  var all = function all(data, fn) {
    data = asArray$1(data);

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
  var times = function times(length, fn) {
    var result = [];

    for (var i = 0, l = length; i < l; i++) {
      result.push(fn(i));
    }

    return result;
  };
  var forMap$1 = function forMap(object, fn) {
    return Object.keys(object).reduce(function (dest, key) {
      dest[key] = fn(object[key], key);
      return dest;
    }, object);
  };

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

    if (typeof start !== "number" || typeof end !== "number") {
      if (typeof start !== "number" && typeof end !== "number") return r;
      if (typeof start === "number") return r.push(start), r;
      if (typeof end === "number") return r.push(end), r;
    }

    if (start > end) {
      reverse = end;
      end = start;
      start = reverse;
      reverse = true;
    }

    end = parseFloat(end), end = isAbsoluteNaN(end) ? 0 : end;
    start = parseFloat(start), start = isAbsoluteNaN(start) ? 0 : start;
    step = parseFloat(step), step = isAbsoluteNaN(step) || step == 0 ? 1 : step;
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
  var domainRangeValue = function domainRangeValue(domain, range, vs, nice) {
    return forMap(cloneDeep(vs), function (v, sel) {
      var $range = sel ? range[sel] : range;
      var $domain = sel ? domain[sel] : domain;

      if (!$range || !$domain) {
        return v;
      }

      var dSize = $domain[1] - $domain[0];
      var sSize = $range[1] - $range[0];
      var dRate = (v - $domain[0]) / dSize;
      var calc = $range[0] + sSize * dRate;
      return nice ? Math.floor(calc) : calc;
    });
  }; //matrixRange([1],[3]) // [[1], [2], [3]] 
  //matrixRange([1,1],[3,3]) // [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]

  var matrixRange = function matrixRange(start, end, step, sizeBase) {
    var scales = [];
    var maxLength = max([start.length, end.length]);
    var selectLengthes = times(maxLength, function (scaleIndex) {
      var range = range([start[scaleIndex], end[scaleIndex]], step, sizeBase);
      scales.push(range);
      return range.length;
    });
    var result = times(reduce(selectLengthes, function (redu, value) {
      return redu * value;
    }, 1), function () {
      return new Array(maxLength);
    });
    var turnSize = 1;
    each(scales, function (scaleCase, scaleIndex) {
      var scaleCaseLength = scaleCase.length;
      times(result.length, function (time) {
        result[time][scaleIndex] = scaleCase[turn$1(time, scaleCaseLength, turnSize)];
      });
      turnSize = turnSize * scaleCaseLength;
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
    if (isArray$1(dv)) dv = dv.join(' ');
    var dt = /(\d\d\d\d|)[^\d]?(\d\d|\d|).?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)/.exec(dv);
    dt[1] = dt[1] || new Date().getYear() + 1900 + '';
    dt[2] = dt[2] || new Date().getMonth() + 1;
    dt[3] = dt[3] || new Date().getDate();
    dt[4] = dt[4] || "00";
    dt[5] = dt[5] || "00";
    dt[6] = dt[6] || "00";
    var r = [dt[1], dt[2], dt[3], dt[4], dt[5], dt[6], dt[0]];
    r.year = dt[1], r.month = dt[2], r.date = dt[3], r.hour = dt[4], r.minute = dt[5], r.second = dt[6], r.init = dt[7];

    r.format = function (s) {
      return s.replace('YYYY', r.year).replace(/(MM|M)/, r.month).replace(/(DD|D)/, r.date).replace(/(hh|h)/, r.hour).replace(/(mm|m)/, r.minute).replace(/(ss|s)/, r.second).replace(/(A)/, toNumber(r.hour) > 12 ? 'PM' : 'AM');
    };

    if (typeof format === 'string') return r.format(format);
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

    if (isArray$1(exp) && exp.length == 7) {
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

  //정의역과 치역을 계산하여 결과값을 리턴함, 속성별로 정의하여 다중 차원 지원

  var Block = function Block(posSize, syncOpt) {
    this.$space = void 0;
    this.$posSize;
    this.$mask;
    this.$compute;
    this.$sync;
    this.sync(posSize, syncOpt);
  };

  Block.prototype = {
    sync: function sync(block, syncOpt) {
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

      if (block instanceof Block) {
        this.$posSize = _cloneDeep(block.$posSize); //.. this.$sync    = this.$sync || block.$sync

        this.$space = this.$space || block.$space;
        this.$mask = this.$mask || block.$mask;
      } else {
        this.$posSize = forMap$1(_cloneDeep(block), function (posSize) {
          return !_.isArray(posSize) ? [posSize, 0] : posSize;
        });
      }

      return this;
    },
    clone: function clone$$1() {
      return new Block(this);
    },
    setPosition: function setPosition(value, sel) {
      var $posSize = get$1(this.$posSize, sel);
      if ($posSize instanceof Array) $posSize[0] = value;
      return this;
    },
    setSize: function setSize(value, sel) {
      var $posSize = get$1(this.$posSize, sel);
      if ($posSize instanceof Array) $posSize[1] = value;
      return this;
    },
    get: function get() {
      return _cloneDeep(typeof this.$posSize === "function" ? this.$posSize() : this.$posSize);
    },
    domainValue: function domainValue() {
      return forMap$1(_cloneDeep(this.get()), function (posSize) {
        return posSize[0];
      });
    },
    domainSize: function domainSize() {
      return forMap$1(_cloneDeep(this.get()), function (posSize) {
        return posSize[1];
      });
    },
    domainMap: function domainMap() {
      return forMap$1(_cloneDeep(this.get()), function (posSize) {
        return {
          start: posSize[0],
          size: posSize[1],
          end: posSize[0] + posSize[1]
        };
      });
    },
    conflicts: function conflicts(otherBlocks, selector) {
      return asArray$1(otherBlocks).reduce(function (red, block) {
        var selectOtherBlock = get$1(block, selector);

        if (selectOtherBlock instanceof Block) {
          //다른 블럭이 현재 블럭과 같거나 space가 다를때는 평가하지 않음
          if (selectOtherBlock === this || selectOtherBlock.$space != this.$space) return red; //

          var inspectResult = [];
          forMap$1(this.get(), function (thisPos, key) {
            var otherPos = get$1(selectOtherBlock.get(), key);
            if (otherPos[0] < thisPos[0] && otherPos[0] + otherPos[1] <= thisPos[0]) return inspectResult.push(false);
            if (otherPos[0] > thisPos[0] && thisPos[0] + thisPos[1] <= otherPos[0]) return inspectResult.push(false);
            return inspectResult.push(true);
          });

          if (inspectResult.length && !hasProperty(inspectResult, false)) {
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
      var overflowDomain = mask && _cloneDeep(mask) || this.$space && this.$space.getDomain() || [];
      return forMap$1(overflowDomain, function ($overflowSelected, sel) {
        var $posSize = get$1(blockPosSize, sel);
        var $domain = get$1(spaceDomain, sel);
        return $posSize[0] < get$1($overflowSelected[0], $domain[0]) || $posSize[0] + $posSize[1] > get$1($overflowSelected[1], $domain[1]);
      });
    },
    isOverflow: function isOverflow(mask) {
      var overflow = false;
      forMap$1(this.overflow(mask), function (f) {
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
      return this.$space.domainRange(forMap$1(this.get(), function (posSize) {
        return posSize[0];
      }));
    },
    rangeSize: function rangeSize() {
      return this.$space.domainRangeSize(forMap$1(this.get(), function (posSize) {
        return posSize[1];
      }));
    },
    rangeMap: function rangeMap() {
      var rangeSize = this.rangeSize();
      return forMap$1(this.rangeStart(), function ($start, sel) {
        var $size = sel ? rangeSize[sel] : rangeSize;
        return {
          start: $start,
          size: $size,
          end: $start + $size
        };
      }.bind(this));
    },
    map: function map() {
      var domainMap = this.domainMap();
      var rangeMap = this.rangeMap();
      var blockMap = forMap$1(rangeMap, function (map, key) {
        map.rangeStart = map.start, map.rangeSize = map.size, map.rangeEnd = map.end;
        var $domainMap = get$1(domainMap, key);
        map.domainStart = $domainMap.start, map.domainSize = $domainMap.size, map.domainEnd = $domainMap.end;
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
    this.$domainMask = forMap$1(_cloneDeep(domainMask), function (mask, sel) {
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
      var domainGrid = forMap$1(this.$space.getRange(), function (range$$1) {
        return range$$1[2];
      });
      var block = this.block(forMap$1(this.$space.rangeDomain(cursor), function (cursorPoint, key) {
        return [cursorPoint, get$1(domainGrid, key)];
      }));
      var blockMap = block.map();
      callback && callback.call(block, blockMap, block);
      return block;
    }
  };

  var Space = function Space(domain, range$$1) {
    this.domain(domain);
    this.range(range$$1);
    this.$niceDomain = true;
    this.$niceRange = true;
  };

  Space.prototype = {
    domain: function domain(_domain) {
      //default grid scale
      _domain = forMap$1(_domain, function (domain) {
        if (!domain[2]) {
          domain[2] = 1;
        }

        return domain;
      });
      this.$domain = _domain;
    },
    range: function range$$1(_range) {
      _range = forMap$1(_range, function (range$$1) {
        if (!range$$1[2]) {
          range$$1[2] = 1;
        }

        return range$$1;
      });
      this.$range = _range;
    },
    getRange: function getRange() {
      return forMap$1(_cloneDeep(this.$range), function (range$$1) {
        for (var i = 0, l = range$$1.length; i < l; i++) {
          if (typeof range$$1[i] === "function") range$$1[i] = range$$1[i]();
        }

        return range$$1;
      });
    },
    getDomain: function getDomain() {
      return forMap$1(_cloneDeep(this.$domain), function (domain) {
        for (var i = 0, l = domain.length; i < l; i++) {
          if (typeof domain[i] === "function") domain[i] = domain[i]();
        }

        return domain;
      });
    },
    domainRangeSize: function domainRangeSize(vs) {
      return forMap$1(vs, function (v, sel) {
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

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }

  var eq_1 = eq;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function assocIndexOf(array, key) {
    var length = array.length;

    while (length--) {
      if (eq_1(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }

  var _assocIndexOf = assocIndexOf;

  /** Used for built-in method references. */


  var arrayProto = Array.prototype;
  /** Built-in value references. */

  var splice = arrayProto.splice;
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  function listCacheDelete(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }

    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function listCacheGet(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function listCacheHas(key) {
    return _assocIndexOf(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas;

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */


  function listCacheSet(key, value) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  }

  var _listCacheSet = listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */


  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `ListCache`.


  ListCache.prototype.clear = _listCacheClear;
  ListCache.prototype['delete'] = _listCacheDelete;
  ListCache.prototype.get = _listCacheGet;
  ListCache.prototype.has = _listCacheHas;
  ListCache.prototype.set = _listCacheSet;
  var _ListCache = ListCache;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */


  function stackClear() {
    this.__data__ = new _ListCache();
    this.size = 0;
  }

  var _stackClear = stackClear;

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);
    this.size = data.size;
    return result;
  }

  var _stackDelete = stackDelete;

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  var _stackGet = stackGet;

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  var _stackHas = stackHas;

  /* Built-in method references that are verified to be native. */


  var nativeCreate = _getNative(Object, 'create');
  var _nativeCreate = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */


  function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear;

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete;

  /** Used to stand-in for `undefined` hash values. */


  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  /** Used for built-in method references. */

  var objectProto$7 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  function hashGet(key) {
    var data = this.__data__;

    if (_nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }

    return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */


  var objectProto$8 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  function hashHas(key) {
    var data = this.__data__;
    return _nativeCreate ? data[key] !== undefined : hasOwnProperty$6.call(data, key);
  }

  var _hashHas = hashHas;

  /** Used to stand-in for `undefined` hash values. */


  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */

  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = _nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */


  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `Hash`.


  Hash.prototype.clear = _hashClear;
  Hash.prototype['delete'] = _hashDelete;
  Hash.prototype.get = _hashGet;
  Hash.prototype.has = _hashHas;
  Hash.prototype.set = _hashSet;
  var _Hash = Hash;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */


  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new _Hash(),
      'map': new (_Map || _ListCache)(),
      'string': new _Hash()
    };
  }

  var _mapCacheClear = mapCacheClear;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }

  var _isKeyable = isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */


  function getMapData(map, key) {
    var data = map.__data__;
    return _isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }

  var _getMapData = getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function mapCacheDelete(key) {
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function mapCacheGet(key) {
    return _getMapData(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function mapCacheHas(key) {
    return _getMapData(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas;

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */


  function mapCacheSet(key, value) {
    var data = _getMapData(this, key),
        size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */


  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `MapCache`.


  MapCache.prototype.clear = _mapCacheClear;
  MapCache.prototype['delete'] = _mapCacheDelete;
  MapCache.prototype.get = _mapCacheGet;
  MapCache.prototype.has = _mapCacheHas;
  MapCache.prototype.set = _mapCacheSet;
  var _MapCache = MapCache;

  /** Used as the size to enable large array optimizations. */


  var LARGE_ARRAY_SIZE = 200;
  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */

  function stackSet(key, value) {
    var data = this.__data__;

    if (data instanceof _ListCache) {
      var pairs = data.__data__;

      if (!_Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }

      data = this.__data__ = new _MapCache(pairs);
    }

    data.set(key, value);
    this.size = data.size;
    return this;
  }

  var _stackSet = stackSet;

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */


  function Stack(entries) {
    var data = this.__data__ = new _ListCache(entries);
    this.size = data.size;
  } // Add methods to `Stack`.


  Stack.prototype.clear = _stackClear;
  Stack.prototype['delete'] = _stackDelete;
  Stack.prototype.get = _stackGet;
  Stack.prototype.has = _stackHas;
  Stack.prototype.set = _stackSet;
  var _Stack = Stack;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';
  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */

  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED$2);

    return this;
  }

  var _setCacheAdd = setCacheAdd;

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  var _setCacheHas = setCacheHas;

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */


  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;
    this.__data__ = new _MapCache();

    while (++index < length) {
      this.add(values[index]);
    }
  } // Add methods to `SetCache`.


  SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
  SetCache.prototype.has = _setCacheHas;
  var _SetCache = SetCache;

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }

    return false;
  }

  var _arraySome = arraySome;

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  var _cacheHas = cacheHas;

  /** Used to compose bitmasks for value comparisons. */


  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;
  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */

  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    } // Assume cyclic values are equal.


    var stacked = stack.get(array);

    if (stacked && stack.get(other)) {
      return stacked == other;
    }

    var index = -1,
        result = true,
        seen = bitmask & COMPARE_UNORDERED_FLAG ? new _SetCache() : undefined;
    stack.set(array, other);
    stack.set(other, array); // Ignore non-index properties.

    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }

      if (compared !== undefined) {
        if (compared) {
          continue;
        }

        result = false;
        break;
      } // Recursively compare arrays (susceptible to call stack limits).


      if (seen) {
        if (!_arraySome(other, function (othValue, othIndex) {
          if (!_cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }

    stack['delete'](array);
    stack['delete'](other);
    return result;
  }

  var _equalArrays = equalArrays;

  var Symbol$3 = require('./_Symbol'),
      Uint8Array = require('./_Uint8Array'),
      eq$1 = require('./eq'),
      equalArrays$1 = require('./_equalArrays'),
      mapToArray = require('./_mapToArray'),
      setToArray = require('./_setToArray');
  /** Used to compose bitmasks for value comparisons. */


  var COMPARE_PARTIAL_FLAG$1 = 1,
      COMPARE_UNORDERED_FLAG$1 = 2;
  /** `Object#toString` result references. */

  var boolTag$1 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      errorTag$1 = '[object Error]',
      mapTag$3 = '[object Map]',
      numberTag$1 = '[object Number]',
      regexpTag$1 = '[object RegExp]',
      setTag$3 = '[object Set]',
      stringTag$1 = '[object String]',
      symbolTag$1 = '[object Symbol]';
  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$2 = '[object DataView]';
  /** Used to convert symbols to primitives and strings. */

  var symbolProto$1 = Symbol$3 ? Symbol$3.prototype : undefined,
      symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;
  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */

  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag$2:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }

        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag$1:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }

        return true;

      case boolTag$1:
      case dateTag$1:
      case numberTag$1:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq$1(+object, +other);

      case errorTag$1:
        return object.name == other.name && object.message == other.message;

      case regexpTag$1:
      case stringTag$1:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == other + '';

      case mapTag$3:
        var convert = mapToArray;

      case setTag$3:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
        convert || (convert = setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        } // Assume cyclic values are equal.


        var stacked = stack.get(object);

        if (stacked) {
          return stacked == other;
        }

        bitmask |= COMPARE_UNORDERED_FLAG$1; // Recursively compare objects (susceptible to call stack limits).

        stack.set(object, other);
        var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack['delete'](object);
        return result;

      case symbolTag$1:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }

    }

    return false;
  }

  module.exports = equalByTag;

  var _equalByTag = /*#__PURE__*/Object.freeze({

  });

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }

    return array;
  }

  var _arrayPush = arrayPush;

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
  }

  var _baseGetAllKeys = baseGetAllKeys;

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];

      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }

    return result;
  }

  var _arrayFilter = arrayFilter;

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  var stubArray_1 = stubArray;

  /** Used for built-in method references. */


  var objectProto$9 = Object.prototype;
  /** Built-in value references. */

  var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeGetSymbols = Object.getOwnPropertySymbols;
  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */

  var getSymbols = !nativeGetSymbols ? stubArray_1 : function (object) {
    if (object == null) {
      return [];
    }

    object = Object(object);
    return _arrayFilter(nativeGetSymbols(object), function (symbol) {
      return propertyIsEnumerable$1.call(object, symbol);
    });
  };
  var _getSymbols = getSymbols;

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }

    return result;
  }

  var _baseTimes = baseTimes;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  /** Used to detect unsigned integer values. */

  var reIsUint = /^(?:0|[1-9]\d*)$/;
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */

  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }

  var _isIndex = isIndex;

  /** Used for built-in method references. */


  var objectProto$10 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$7 = objectProto$10.hasOwnProperty;
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */

  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_1(value),
        isArg = !isArr && isArguments_1(value),
        isBuff = !isArr && !isArg && isBuffer_1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? _baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$7.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
      key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
      _isIndex(key, length)))) {
        result.push(key);
      }
    }

    return result;
  }

  var _arrayLikeKeys = arrayLikeKeys;

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */


  function keys(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
  }

  var keys_1 = keys;

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function getAllKeys(object) {
    return _baseGetAllKeys(object, keys_1, _getSymbols);
  }

  var _getAllKeys = getAllKeys;

  /** Used to compose bitmasks for value comparisons. */


  var COMPARE_PARTIAL_FLAG$2 = 1;
  /** Used for built-in method references. */

  var objectProto$11 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$8 = objectProto$11.hasOwnProperty;
  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */

  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
        objProps = _getAllKeys(object),
        objLength = objProps.length,
        othProps = _getAllKeys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }

    var index = objLength;

    while (index--) {
      var key = objProps[index];

      if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
        return false;
      }
    } // Assume cyclic values are equal.


    var stacked = stack.get(object);

    if (stacked && stack.get(other)) {
      return stacked == other;
    }

    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;

    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];

      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      } // Recursively compare objects (susceptible to call stack limits).


      if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }

      skipCtor || (skipCtor = key == 'constructor');
    }

    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor; // Non `Object` object instances with different constructors are not equal.

      if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }

    stack['delete'](object);
    stack['delete'](other);
    return result;
  }

  var _equalObjects = equalObjects;

  /** Used to compose bitmasks for value comparisons. */


  var COMPARE_PARTIAL_FLAG$3 = 1;
  /** `Object#toString` result references. */

  var argsTag$2 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      objectTag$2 = '[object Object]';
  /** Used for built-in method references. */

  var objectProto$12 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$9 = objectProto$12.hasOwnProperty;
  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */

  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray_1(object),
        othIsArr = isArray_1(other),
        objTag = objIsArr ? arrayTag$1 : _getTag(object),
        othTag = othIsArr ? arrayTag$1 : _getTag(other);
    objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
    othTag = othTag == argsTag$2 ? objectTag$2 : othTag;
    var objIsObj = objTag == objectTag$2,
        othIsObj = othTag == objectTag$2,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer_1(object)) {
      if (!isBuffer_1(other)) {
        return false;
      }

      objIsArr = true;
      objIsObj = false;
    }

    if (isSameTag && !objIsObj) {
      stack || (stack = new _Stack());
      return objIsArr || isTypedArray_1(object) ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack) : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }

    if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
      var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty$9.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new _Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }

    if (!isSameTag) {
      return false;
    }

    stack || (stack = new _Stack());
    return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  var _baseIsEqualDeep = baseIsEqualDeep;

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */


  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }

    if (value == null || other == null || !isObjectLike_1(value) && !isObjectLike_1(other)) {
      return value !== value && other !== other;
    }

    return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  var _baseIsEqual = baseIsEqual;

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent.
   *
   * **Note:** This method supports comparing arrays, array buffers, booleans,
   * date objects, error objects, maps, numbers, `Object` objects, regexes,
   * sets, strings, symbols, and typed arrays. `Object` objects are compared
   * by their own, not inherited, enumerable properties. Functions and DOM
   * nodes are compared by strict equality, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.isEqual(object, other);
   * // => true
   *
   * object === other;
   * // => false
   */


  function isEqual(value, other) {
    return _baseIsEqual(value, other);
  }

  var isEqual_1 = isEqual;

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
    return get$1(model, "[" + EDITABLE_DEFAULT_KEY + "][0]");
  };

  var getLastModel = function getLastModel(model) {
    var changeHistory = get$1(model, "[" + EDITABLE_DEFAULT_KEY + "]");

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
    return !isEqual_1(cloneCurrentModel(model), getLastModel(model));
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

  var _library = false;

  var _aFunction = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  // optional / simple context binding


  var _ctx = function (fn, that, length) {
    _aFunction(fn);
    if (that === undefined) return fn;

    switch (length) {
      case 1:
        return function (a) {
          return fn.call(that, a);
        };

      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };

      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }

    return function ()
    /* ...args */
    {
      return fn.apply(that, arguments);
    };
  };

  var toString$1 = {}.toString;

  var _cof = function (it) {
    return toString$1.call(it).slice(8, -1);
  };

  // getting tag from 19.1.3.6 Object.prototype.toString()


  var TAG = wks('toStringTag'); // ES3 wrong here


  var ARG = _cof(function () {
    return arguments;
  }()) == 'Arguments'; // fallback for IE11 Script Access Denied error

  var tryGet = function tryGet(it, key) {
    try {
      return it[key];
    } catch (e) {
      /* empty */
    }
  };

  var _classof = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T // builtinTag case
    : ARG ? _cof(O) // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

  var _anInstance = function (it, Constructor, name, forbiddenField) {
    if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
      throw TypeError(name + ': incorrect invocation!');
    }

    return it;
  };

  // call something on iterator step with safe closing on error


  var _iterCall = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(_anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) _anObject(ret.call(iterator));
      throw e;
    }
  };

  var _iterators = {};

  // check on default Array iterator


  var ITERATOR = wks('iterator');

  var ArrayProto = Array.prototype;

  var _isArrayIter = function (it) {
    return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR] === it);
  };

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;

  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.1.15 ToLength


  var min = Math.min;

  var _toLength = function (it) {
    return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = {
    version: '2.5.5'
  };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var ITERATOR$1 = wks('iterator');



  var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$1] || it['@@iterator'] || _iterators[_classof(it)];
  };

  var _forOf = createCommonjsModule(function (module) {
  var BREAK = {};
  var RETURN = {};

  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () {
      return iterable;
    } : core_getIteratorMethod(iterable);
    var f = _ctx(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!'); // fast case for arrays with default iterator

    if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
      result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      if (result === BREAK || result === RETURN) return result;
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      result = _iterCall(iterator, f, step.value, entries);
      if (result === BREAK || result === RETURN) return result;
    }
  };

  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
  });

  // 7.3.20 SpeciesConstructor(O, defaultConstructor)




  var SPECIES = wks('species');

  var _speciesConstructor = function (O, D) {
    var C = _anObject(O).constructor;
    var S;
    return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
  };

  // fast apply, http://jsperf.lnkit.com/fast-apply/5
  var _invoke = function (fn, args, that) {
    var un = that === undefined;

    switch (args.length) {
      case 0:
        return un ? fn() : fn.call(that);

      case 1:
        return un ? fn(args[0]) : fn.call(that, args[0]);

      case 2:
        return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);

      case 3:
        return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);

      case 4:
        return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
    }

    return fn.apply(that, args);
  };

  var document$2 = _global.document;

  var _html = document$2 && document$2.documentElement;

  var process = _global.process;
  var setTask = _global.setImmediate;
  var clearTask = _global.clearImmediate;
  var MessageChannel = _global.MessageChannel;
  var Dispatch = _global.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run = function run() {
    var id = +this; // eslint-disable-next-line no-prototype-builtins

    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };

  var listener = function listener(event) {
    run.call(event.data);
  }; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


  if (!setTask || !clearTask) {
    setTask = function setImmediate(fn) {
      var args = [];
      var i = 1;

      while (arguments.length > i) {
        args.push(arguments[i++]);
      }

      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        _invoke(typeof fn == 'function' ? fn : Function(fn), args);
      };

      defer(counter);
      return counter;
    };

    clearTask = function clearImmediate(id) {
      delete queue[id];
    }; // Node.js 0.8-


    if (_cof(process) == 'process') {
      defer = function defer(id) {
        process.nextTick(_ctx(run, id, 1));
      }; // Sphere (JS game engine) Dispatch API

    } else if (Dispatch && Dispatch.now) {
      defer = function defer(id) {
        Dispatch.now(_ctx(run, id, 1));
      }; // Browsers with MessageChannel, includes WebWorkers

    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = _ctx(port.postMessage, port, 1); // Browsers with postMessage, skip WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
      defer = function defer(id) {
        _global.postMessage(id + '', '*');
      };

      _global.addEventListener('message', listener, false); // IE8-
    } else if (ONREADYSTATECHANGE in _domCreate('script')) {
      defer = function defer(id) {
        _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
          _html.removeChild(this);
          run.call(id);
        };
      }; // Rest old browsers

    } else {
      defer = function defer(id) {
        setTimeout(_ctx(run, id, 1), 0);
      };
    }
  }

  var _task = {
    set: setTask,
    clear: clearTask
  };

  var macrotask = _task.set;

  var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
  var process$1 = _global.process;
  var Promise$2 = _global.Promise;
  var isNode$1 = _cof(process$1) == 'process';

  var _microtask = function () {
    var head, last, notify;

    var flush = function flush() {
      var parent, fn;
      if (isNode$1 && (parent = process$1.domain)) parent.exit();

      while (head) {
        fn = head.fn;
        head = head.next;

        try {
          fn();
        } catch (e) {
          if (head) notify();else last = undefined;
          throw e;
        }
      }

      last = undefined;
      if (parent) parent.enter();
    }; // Node.js


    if (isNode$1) {
      notify = function notify() {
        process$1.nextTick(flush);
      }; // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339

    } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
      var toggle = true;
      var node = document.createTextNode('');
      new Observer(flush).observe(node, {
        characterData: true
      }); // eslint-disable-line no-new

      notify = function notify() {
        node.data = toggle = !toggle;
      }; // environments with maybe non-completely correct, but existent Promise

    } else if (Promise$2 && Promise$2.resolve) {
      var promise = Promise$2.resolve();

      notify = function notify() {
        promise.then(flush);
      }; // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessag
      // - onreadystatechange
      // - setTimeout

    } else {
      notify = function notify() {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(_global, flush);
      };
    }

    return function (fn) {
      var task = {
        fn: fn,
        next: undefined
      };
      if (last) last.next = task;

      if (!head) {
        head = task;
        notify();
      }

      last = task;
    };
  };

  function PromiseCapability(C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = _aFunction(resolve);
    this.reject = _aFunction(reject);
  }

  var f$1 = function (C) {
    return new PromiseCapability(C);
  };

  var _newPromiseCapability = {
  	f: f$1
  };

  var _perform = function (exec) {
    try {
      return {
        e: false,
        v: exec()
      };
    } catch (e) {
      return {
        e: true,
        v: e
      };
    }
  };

  var _promiseResolve = function (C, x) {
    _anObject(C);
    if (_isObject(x) && x.constructor === C) return x;
    var promiseCapability = _newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var _redefineAll = function (target, src, safe) {
    for (var key in src) {
      redefine(target, key, src[key], safe);
    }

    return target;
  };

  var hasOwnProperty$10 = {}.hasOwnProperty;

  var _has = function (it, key) {
    return hasOwnProperty$10.call(it, key);
  };

  var def = _objectDp.f;



  var TAG$1 = wks('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, {
      configurable: true,
      value: tag
    });
  };

  var SPECIES$1 = wks('species');

  var _setSpecies = function (KEY) {
    var C = _global[KEY];
    if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
      configurable: true,
      get: function get() {
        return this;
      }
    });
  };

  var ctx$1 = require('./_ctx');

  var $export$4 = require('./_export');

  var toObject$1 = require('./_to-object');

  var call = require('./_iter-call');

  var isArrayIter = require('./_is-array-iter');

  var toLength = require('./_to-length');

  var createProperty = require('./_create-property');

  var getIterFn = require('./core.get-iterator-method');

  $export$4($export$4.S + $export$4.F * !require('./_iter-detect')(function (iter) {
  }), 'Array', {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function from(arrayLike
    /* , mapfn = undefined, thisArg = undefined */
    ) {
      var O = toObject$1(arrayLike);
      var C = typeof this == 'function' ? this : Array;
      var aLen = arguments.length;
      var mapfn = aLen > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      var index = 0;
      var iterFn = getIterFn(O);
      var length, result, step, iterator;
      if (mapping) mapfn = ctx$1(mapfn, aLen > 2 ? arguments[2] : undefined, 2); // if object isn't iterable or it's array with default iterator - use simple case

      if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
        for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
          createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
        }
      } else {
        length = toLength(O.length);

        for (result = new C(length); length > index; index++) {
          createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
        }
      }

      result.length = index;
      return result;
    }
  });

  var ITERATOR$2 = require('./_wks')('iterator');

  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$2]();

    riter['return'] = function () {
      SAFE_CLOSING = true;
    }; // eslint-disable-next-line no-throw-literal
  } catch (e) {
    /* empty */
  }

  module.exports = function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;

    try {
      var arr = [7];
      var iter = arr[ITERATOR$2]();

      iter.next = function () {
        return {
          done: safe = true
        };
      };

      arr[ITERATOR$2] = function () {
        return iter;
      };

      exec(arr);
    } catch (e) {
      /* empty */
    }

    return safe;
  };

  var _iterDetect = /*#__PURE__*/Object.freeze({

  });

  var task = _task.set;

  var microtask = _microtask();







  var PROMISE = 'Promise';
  var TypeError$1 = _global.TypeError;
  var process$2 = _global.process;
  var $Promise = _global[PROMISE];
  var isNode$2 = _classof(process$2) == 'process';

  var empty = function empty() {
    /* empty */
  };

  var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
  var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;
  var USE_NATIVE$1 = !!function () {
    try {
      // correct subclassing with @@species support
      var promise = $Promise.resolve(1);

      var FakePromise = (promise.constructor = {})[wks('species')] = function (exec) {
        exec(empty, empty);
      }; // unhandled rejections tracking support, NodeJS Promise without it fails @@species test


      return (isNode$2 || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
    } catch (e) {
      /* empty */
    }
  }(); // helpers

  var isThenable = function isThenable(it) {
    var then;
    return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };

  var notify = function notify(promise, isReject) {
    if (promise._n) return;
    promise._n = true;
    var chain = promise._c;
    microtask(function () {
      var value = promise._v;
      var ok = promise._s == 1;
      var i = 0;

      var run = function run(reaction) {
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;

        try {
          if (handler) {
            if (!ok) {
              if (promise._h == 2) onHandleUnhandled(promise);
              promise._h = 1;
            }

            if (handler === true) result = value;else {
              if (domain) domain.enter();
              result = handler(value); // may throw

              if (domain) {
                domain.exit();
                exited = true;
              }
            }

            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (e) {
          if (domain && !exited) domain.exit();
          reject(e);
        }
      };

      while (chain.length > i) {
        run(chain[i++]);
      } // variable length - can't use forEach


      promise._c = [];
      promise._n = false;
      if (isReject && !promise._h) onUnhandled(promise);
    });
  };

  var onUnhandled = function onUnhandled(promise) {
    task.call(_global, function () {
      var value = promise._v;
      var unhandled = isUnhandled(promise);
      var result, handler, console;

      if (unhandled) {
        result = _perform(function () {
          if (isNode$2) {
            process$2.emit('unhandledRejection', value, promise);
          } else if (handler = _global.onunhandledrejection) {
            handler({
              promise: promise,
              reason: value
            });
          } else if ((console = _global.console) && console.error) {
            console.error('Unhandled promise rejection', value);
          }
        }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

        promise._h = isNode$2 || isUnhandled(promise) ? 2 : 1;
      }

      promise._a = undefined;
      if (unhandled && result.e) throw result.v;
    });
  };

  var isUnhandled = function isUnhandled(promise) {
    return promise._h !== 1 && (promise._a || promise._c).length === 0;
  };

  var onHandleUnhandled = function onHandleUnhandled(promise) {
    task.call(_global, function () {
      var handler;

      if (isNode$2) {
        process$2.emit('rejectionHandled', promise);
      } else if (handler = _global.onrejectionhandled) {
        handler({
          promise: promise,
          reason: promise._v
        });
      }
    });
  };

  var $reject = function $reject(value) {
    var promise = this;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap

    promise._v = value;
    promise._s = 2;
    if (!promise._a) promise._a = promise._c.slice();
    notify(promise, true);
  };

  var $resolve = function $resolve(value) {
    var promise = this;
    var then;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap

    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");

      if (then = isThenable(value)) {
        microtask(function () {
          var wrapper = {
            _w: promise,
            _d: false
          }; // wrap

          try {
            then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
          } catch (e) {
            $reject.call(wrapper, e);
          }
        });
      } else {
        promise._v = value;
        promise._s = 1;
        notify(promise, false);
      }
    } catch (e) {
      $reject.call({
        _w: promise,
        _d: false
      }, e); // wrap
    }
  }; // constructor polyfill


  if (!USE_NATIVE$1) {
    // 25.4.3.1 Promise(executor)
    $Promise = function Promise(executor) {
      _anInstance(this, $Promise, PROMISE, '_h');
      _aFunction(executor);
      Internal.call(this);

      try {
        executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
      } catch (err) {
        $reject.call(this, err);
      }
    }; // eslint-disable-next-line no-unused-vars


    Internal = function Promise(executor) {
      this._c = []; // <- awaiting reactions

      this._a = undefined; // <- checked in isUnhandled reactions

      this._s = 0; // <- state

      this._d = false; // <- done

      this._v = undefined; // <- value

      this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled

      this._n = false; // <- notify
    };

    Internal.prototype = _redefineAll($Promise.prototype, {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function then(onFulfilled, onRejected) {
        var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = isNode$2 ? process$2.domain : undefined;

        this._c.push(reaction);

        if (this._a) this._a.push(reaction);
        if (this._s) notify(this, false);
        return reaction.promise;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function _catch(onRejected) {
        return this.then(undefined, onRejected);
      }
    });

    OwnPromiseCapability = function OwnPromiseCapability() {
      var promise = new Internal();
      this.promise = promise;
      this.resolve = _ctx($resolve, promise, 1);
      this.reject = _ctx($reject, promise, 1);
    };

    _newPromiseCapability.f = newPromiseCapability = function newPromiseCapability(C) {
      return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
    };
  }

  $export$1($export$1.G + $export$1.W + $export$1.F * !USE_NATIVE$1, {
    Promise: $Promise
  });

  _setToStringTag($Promise, PROMISE);

  _setSpecies(PROMISE);

  Wrapper = _core[PROMISE]; // statics

  $export$1($export$1.S + $export$1.F * !USE_NATIVE$1, PROMISE, {
    // 25.4.4.5 Promise.reject(r)
    reject: function reject(r) {
      var capability = newPromiseCapability(this);
      var $$reject = capability.reject;
      $$reject(r);
      return capability.promise;
    }
  });
  $export$1($export$1.S + $export$1.F * (_library || !USE_NATIVE$1), PROMISE, {
    // 25.4.4.6 Promise.resolve(x)
    resolve: function resolve(x) {
      return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
    }
  });
  $export$1($export$1.S + $export$1.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
    $Promise.all(iter)['catch'](empty);
  })), PROMISE, {
    // 25.4.4.1 Promise.all(iterable)
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = _perform(function () {
        var values = [];
        var index = 0;
        var remaining = 1;
        _forOf(iterable, false, function (promise) {
          var $index = index++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[$index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.e) reject(result.v);
      return capability.promise;
    },
    // 25.4.4.4 Promise.race(iterable)
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = _perform(function () {
        _forOf(iterable, false, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.e) reject(result.v);
      return capability.promise;
    }
  });

  // Works with __proto__ only. Old v8 can't work with null proto objects.

  /* eslint-disable no-proto */
  var isObject$4 = require('./_is-object');

  var anObject$1 = require('./_an-object');

  var check = function check(O, proto) {
    anObject$1(O);
    if (!isObject$4(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
  };

  module.exports = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) {
        buggy = true;
      }

      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
    check: check
  };

  var _setProto = /*#__PURE__*/Object.freeze({

  });

  // 19.1.3.19 Object.setPrototypeOf(O, proto)


  $export$1($export$1.S, 'Object', {
    setPrototypeOf: _setProto.set
  });

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  !function (global) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined; // More compressible than void 0.

    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    var inModule = typeof module === "object";
    var runtime = global.regeneratorRuntime;

    if (runtime) {
      if (inModule) {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        module.exports = runtime;
      } // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.


      return;
    } // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.


    runtime = global.regeneratorRuntime = inModule ? module.exports : {};

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    runtime.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    runtime.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;

        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    runtime.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            resolve(result);
          }, reject);
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    runtime.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    runtime.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
      return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          if (delegate.iterator.return) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    runtime.values = values;

    function doneResult() {
      return {
        value: undefined,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },
      stop: function stop() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined;
        }

        return ContinueSentinel;
      }
    };
  }( // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  function () {
    return this;
  }() || Function("return this")());

  // 7.1.13 ToObject(argument)


  var _toObject = function (it) {
    return Object(_defined(it));
  };

  var max$1 = Math.max;
  var min$1 = Math.min;

  var _toAbsoluteIndex = function (index, length) {
    index = _toInteger(index);
    return index < 0 ? max$1(index + length, 0) : min$1(index, length);
  };

  var _arrayFill = function fill(value
  /* , start = 0, end = @length */
  ) {
    var O = _toObject(this);
    var length = _toLength(O.length);
    var aLen = arguments.length;
    var index = _toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
    var end = aLen > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : _toAbsoluteIndex(end, length);

    while (endPos > index) {
      O[index++] = value;
    }

    return O;
  };

  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = wks('unscopables');

  var ArrayProto$1 = Array.prototype;
  if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});

  var _addToUnscopables = function (key) {
    ArrayProto$1[UNSCOPABLES][key] = true;
  };

  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


  $export$1($export$1.P, 'Array', {
    fill: _arrayFill
  });

  _addToUnscopables('fill');

  var _stringRepeat = function repeat(count) {
    var str = String(_defined(this));
    var res = '';
    var n = _toInteger(count);
    if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");

    for (; n > 0; (n >>>= 1) && (str += str)) {
      if (n & 1) res += str;
    }

    return res;
  };

  $export$1($export$1.P, 'String', {
    // 21.1.3.13 String.prototype.repeat(count)
    repeat: _stringRepeat
  });

  var _iterStep = function (done, value) {
    return {
      value: value,
      done: !!done
    };
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var cof = require('./_cof'); // eslint-disable-next-line no-prototype-builtins


  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };

  var _iobject = /*#__PURE__*/Object.freeze({

  });

  // to indexed object, toObject with fallback for non-array-like ES3 strings




  var _toIobject = function (it) {
    return _iobject(_defined(it));
  };

  var LIBRARY = require('./_library');

  var $export$5 = require('./_export');

  var redefine$3 = require('./_redefine');

  var hide$2 = require('./_hide');

  var Iterators = require('./_iterators');

  var $iterCreate = require('./_iter-create');

  var setToStringTag$1 = require('./_set-to-string-tag');

  var getPrototypeOf = require('./_object-gpo');

  var ITERATOR$3 = require('./_wks')('iterator');

  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`

  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function returnThis() {
    return this;
  };

  module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);

    var getMethod = function getMethod(kind) {
      if (!BUGGY && kind in proto) return proto[kind];

      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };

        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }

      return function entries() {
        return new Constructor(this, kind);
      };
    };

    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR$3] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype; // Fix native

    if ($anyNative) {
      IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));

      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        setToStringTag$1(IteratorPrototype, TAG, true); // fix for some old engines

        if (!LIBRARY && typeof IteratorPrototype[ITERATOR$3] != 'function') hide$2(IteratorPrototype, ITERATOR$3, returnThis);
      }
    } // fix Array#{values, @@iterator}.name in V8 / FF


    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;

      $default = function values() {
        return $native.call(this);
      };
    } // Define iterator


    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR$3])) {
      hide$2(proto, ITERATOR$3, $default);
    } // Plug for library


    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;

    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) redefine$3(proto, key, methods[key]);
      } else $export$5($export$5.P + $export$5.F * (BUGGY || VALUES_BUG), NAME, methods);
    }

    return methods;
  };

  var _iterDefine = /*#__PURE__*/Object.freeze({

  });

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()


  var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
    this._t = _toIobject(iterated); // target

    this._i = 0; // next index

    this._k = kind; // kind
    // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;

    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep(1);
    }

    if (kind == 'keys') return _iterStep(0, index);
    if (kind == 'values') return _iterStep(0, O[index]);
    return _iterStep(0, [index, O[index]]);
  }, 'values'); // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)

  _iterators.Arguments = _iterators.Array;
  _addToUnscopables('keys');
  _addToUnscopables('values');
  _addToUnscopables('entries');

  // false -> Array#indexOf
  // true  -> Array#includes






  var _arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = _toIobject($this);
      var length = _toLength(O.length);
      var index = _toAbsoluteIndex(fromIndex, length);
      var value; // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare

      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++]; // eslint-disable-next-line no-self-compare

        if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
      } else for (; length > index; index++) {
        if (IS_INCLUDES || index in O) {
          if (O[index] === el) return IS_INCLUDES || index || 0;
        }
      }
      return !IS_INCLUDES && -1;
    };
  };

  var SHARED = '__core-js_shared__';
  var store$1 = _global[SHARED] || (_global[SHARED] = {});

  var _shared = function (key) {
    return store$1[key] || (store$1[key] = {});
  };

  var id = 0;
  var px = Math.random();

  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var shared$1 = _shared('keys');



  var _sharedKey = function (key) {
    return shared$1[key] || (shared$1[key] = _uid(key));
  };

  var arrayIndexOf = _arrayIncludes(false);

  var IE_PROTO = _sharedKey('IE_PROTO');

  var _objectKeysInternal = function (object, names) {
    var O = _toIobject(object);
    var i = 0;
    var result = [];
    var key;

    for (key in O) {
      if (key != IE_PROTO) _has(O, key) && result.push(key);
    } // Don't enum bug & hidden keys


    while (names.length > i) {
      if (_has(O, key = names[i++])) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
    }

    return result;
  };

  // IE 8- don't enum bug keys
  module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

  var _enumBugKeys = /*#__PURE__*/Object.freeze({

  });

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)




  var _objectKeys = Object.keys || function keys(O) {
    return _objectKeysInternal(O, _enumBugKeys);
  };

  var ITERATOR$4 = wks('iterator');
  var TO_STRING_TAG = wks('toStringTag');
  var ArrayValues = _iterators.Array;
  var DOMIterables = {
    CSSRuleList: true,
    // TODO: Not spec compliant, should be false.
    CSSStyleDeclaration: false,
    CSSValueList: false,
    ClientRectList: false,
    DOMRectList: false,
    DOMStringList: false,
    DOMTokenList: true,
    DataTransferItemList: false,
    FileList: false,
    HTMLAllCollection: false,
    HTMLCollection: false,
    HTMLFormElement: false,
    HTMLSelectElement: false,
    MediaList: true,
    // TODO: Not spec compliant, should be false.
    MimeTypeArray: false,
    NamedNodeMap: false,
    NodeList: true,
    PaintRequestList: false,
    Plugin: false,
    PluginArray: false,
    SVGLengthList: false,
    SVGNumberList: false,
    SVGPathSegList: false,
    SVGPointList: false,
    SVGStringList: false,
    SVGTransformList: false,
    SourceBufferList: false,
    StyleSheetList: true,
    // TODO: Not spec compliant, should be false.
    TextTrackCueList: false,
    TextTrackList: false,
    TouchList: false
  };

  for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
    var NAME$1 = collections[i];
    var explicit = DOMIterables[NAME$1];
    var Collection = _global[NAME$1];
    var proto = Collection && Collection.prototype;
    var key;

    if (proto) {
      if (!proto[ITERATOR$4]) _hide(proto, ITERATOR$4, ArrayValues);
      if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME$1);
      _iterators[NAME$1] = ArrayValues;
      if (explicit) for (key in es6_array_iterator) {
        if (!proto[key]) redefine(proto, key, es6_array_iterator[key], true);
      }
    }
  }

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
        get: function get() {
          var limit = _this.limitInput - _this.inputs.length;
          if (limit < 0) limit = 0;
          return limit;
        }
      });
      Object.defineProperty(this, "avaliableOutputCount", {
        get: function get() {
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
                        var out;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                if (!(typeof output === "function")) {
                                  _context.next = 4;
                                  break;
                                }

                                _context.next = 3;
                                return output({
                                  entry: formInputDataum
                                });

                              case 3:
                                out = _context.sent;

                              case 4:
                                _this.outputs.push(formInputDataum);

                                current--;

                                _this.children.forEach(function (child) {
                                  return child.emit(PARENT_OUTPUT_UPDATED);
                                });

                                kickStart();

                              case 8:
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
          asArray$1(pushData).forEach(function (d) {
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
        value: function value(deep, parentOperate) {
          if (deep === void 0) {
            deep = true;
          }

          var cloneOperate = operateFunction({
            input: input,
            output: output,
            concurrent: concurrent,
            rescue: rescue,
            limitInput: limitInput,
            limitOutput: limitOutput
          });
          deep === true && _this.children.forEach(function (child) {
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

  var PromiseClass = Promise;

  var isMaybePromise = function isMaybePromise(target) {
    return typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function";
  };

  var resolveFn = PromiseClass.resolve;
  var rejectFn = PromiseClass.reject;

  var PromiseFunction = function PromiseFunction(fn) {
    return new PromiseClass(function (r, c) {
      var maybeAwaiter = fn(r, c);
      isMaybePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
    });
  };

  var promise = PromiseFunction;
  var all$1 = PromiseFunction.all = Promise.all;
  var resolve = PromiseFunction.resolve = resolveFn;
  var reject = PromiseFunction.reject = rejectFn;
  var timeout = PromiseFunction.timeout = function (fn, time) {
    if (typeof fn === "number") {
      return PromiseFunction(function (resolve) {
        return setTimeout(function () {
          return resolve(time);
        }, fn);
      });
    } else {
      return PromiseFunction(function (resolve) {
        return setTimeout(function () {
          return resolve(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };
  var valueOf = PromiseFunction.valueOf = function (maybeQ) {
    return PromiseFunction(function (resolve, reject) {
      isMaybePromise(maybeQ) ? maybeQ.then(resolve).catch(reject) : resolve(maybeQ);
    });
  };
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
  var abort = PromiseFunction.abort = function (notifyConsole) {
    if (notifyConsole === void 0) {
      notifyConsole = undefined;
    }

    return new PromiseClass(function (resolve, reject) {
      if (notifyConsole === true) {
        console.warn("abort promise");
      }

      reject(abortMessage);
    });
  };
  var defer$1 = PromiseFunction.defer = function () {
    var resolve, reject;
    var promise = new PromiseClass(function () {
      resolve = arguments[0];
      reject = arguments[1];
    });
    return {
      resolve: resolve,
      reject: reject,
      promise: promise
    };
  };
  var wheel = PromiseFunction.wheel = function (tasks, option) {
    if (!(tasks instanceof Array)) {
      return PromiseFunction.reject(new Error("tasks must be array"));
    }

    if (!tasks.length || !tasks.some(function (e) {
      return typeof e === "function";
    })) {
      return PromiseFunction.reject(new Error("not found wheel executable"));
    }

    if (!tasks.some(function (e) {
      return typeof e !== "function" || typeof e !== "number";
    })) {
      return PromiseFunction.reject(new Error("wheel task only function or number executable"));
    }

    if (typeof option !== "object") {
      option = {};
    }

    var finished = false;
    var defer = PromiseFunction.defer();
    var limit = typeof option.limit === "number" && option.limit > 0 ? parseInt(option.limit, 10) : 10000;
    var taskLength = tasks.length;
    var wheelTick = 0;
    var resetScope = 0;

    var nextWheelTick = function nextWheelTick(tick, value, tickScope) {
      var nowAction = tasks[turn(tick, taskLength, 1)];

      var isActiveFn = function isActiveFn() {
        return tickScope === resetScope;
      };

      var nextTickFn = function nextTickFn(passValue) {
        // if reset called
        if (!isActiveFn()) return; // if over tick

        if (wheelTick > limit) {
          return defer.reject(new Error("limit"));
        }

        if (finished === false) {
          nextWheelTick(wheelTick++, passValue, tickScope);
        }
      };

      if (typeof nowAction === "function") {
        nowAction({
          value: value,
          next: nextTickFn,
          isActive: isActiveFn,
          resolve: defer.resolve,
          reject: defer.reject
        }, Math.floor(tick / tasks.length), tick);
      } else if (typeof nowAction === "number") {
        setTimeout(function () {
          nextTickFn(value);
        }, nowAction);
      }
    };

    defer.promise.then(function (e) {
      if (finished === null) return PromiseFunction.abort();
      finished = true;
      return e;
    }).catch(function (e) {
      if (finished === null) return PromiseFunction.abort();
      finished = true;
      return e;
    });

    defer.stop = function (resetTick) {
      finished = null;
      resetScope += 1;
    };

    defer.start = function (resetTick) {
      if (finished === null) {
        finished = false;
        wheelTick = typeof resetTick === "number" ? resetTick : 0;
        nextWheelTick(wheelTick++, option.value, resetScope);
      }
    };

    defer.reset = function (resetTick) {
      defer.stop();
      defer.start(resetTick);
    };

    defer.reset(0);
    return defer;
  };
  var sequance = PromiseFunction.sequance = function (funcArray, opts) {
    return q(function (resolve, reject) {
      var option = asObject(opts, "concurrent");

      if (option.concurrent === true) {
        option.concurrent = Number.POSITIVE_INFINITY;
      } else if (!isNumber(option.concurrent) || option.concurrent < 1) {
        option.concurrent = 1;
      }

      if (!isNumber(option.interval) || option.interval < -1) {
        option.interval = -1;
      }

      if (!isNumber(option.repeat) || option.repeat < 1) {
        option.repeat = 1;
      } //set task with repeat


      var sequanceTaskEntries = Array(option.repeat).fill(asArray$1(funcArray)).reduce(function (dest, tasks) {
        tasks.forEach(function (fn, index) {
          return dest.push([index, fn]);
        });
        return dest;
      }, []);
      var sequanceLength = sequanceTaskEntries.length;
      var sequanceComplete = 0;
      var sequanceReseult = Array(sequanceTaskEntries.length);
      var sequanceOperator = operate({
        output: function () {
          var _output = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(_ref) {
            var entry;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    entry = _ref.entry;

                    if (!(option.interval > -1)) {
                      _context.next = 4;
                      break;
                    }

                    _context.next = 4;
                    return q.timeout(option.interval);

                  case 4:
                    return _context.abrupt("return", entry);

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function output(_x) {
            return _output.apply(this, arguments);
          };
        }(),
        limitOutput: 1
      }).operate({
        concurrent: option.concurrent,
        input: function () {
          var _input = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(_ref2) {
            var entry, index, fn;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    entry = _ref2.entry;
                    index = entry[0], fn = entry[1];
                    _context2.t0 = entry;
                    _context2.next = 5;
                    return fn();

                  case 5:
                    _context2.t1 = _context2.sent;

                    _context2.t0.push.call(_context2.t0, _context2.t1);

                    return _context2.abrupt("return", entry);

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          return function input(_x2) {
            return _input.apply(this, arguments);
          };
        }(),
        output: function output(_ref3) {
          var entry = _ref3.entry;
          var index = entry[0],
              fn = entry[1],
              result = entry[2];
          sequanceReseult[index] = result;
          sequanceComplete++;

          if (sequanceComplete === sequanceLength) {
            resolve(sequanceReseult);
          }
        }
      }).concat(sequanceTaskEntries);
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
          return promise(function (resolve$$1, reject$$1) {
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

        return promise(function (resolve$$1, reject$$1) {
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

      var destOldValue = _cloneDeep(newValue);

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
          if (!_isEqual(this.$oldValue, newValue)) {
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
        return promise.reject(new Error("paginate::다른 페이징 작업 중에 페이징 처리를 할 수 없습니다."));
      }

      if (typeof payload === "object") {
        payload = Object.assign(this.pageState, this.parameters, payload);
      }

      this.$fetchState = 0;
      this.$pending = true;
      return promise(function (resolve$$1, reject$$1) {
        promise.valueOf(_this.$fetchFn(payload)).then(function (e) {
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
        return promise.reject("paginate::-1 이하로 페이지네이션에 접근 할 수 없습니다.");
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
        return promise.reject("paginate::unknown command", command);
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



  var functions = /*#__PURE__*/Object.freeze({
    isAbsoluteNaN: isAbsoluteNaN,
    isNone: isNone,
    isNumber: isNumber,
    isInteger: isInteger,
    isArray: isArray$1,
    isObject: isObject$1,
    isFunction: isFunction,
    likeString: likeString,
    likeNumber: likeNumber,
    likeArray: likeArray,
    isNode: isNode,
    isEmpty: isEmpty,
    likeRegexp: likeRegexp,
    isPlainObject: isPlainObject,
    isExsist: isExsist,
    notExsist: notExsist,
    asArray: asArray$1,
    toArray: toArray,
    asObject: asObject,
    toNumber: toNumber,
    cleanObject: cleanObject,
    clone: clone,
    cloneDeep: cloneDeep,
    free: free,
    removeValue: removeValue,
    instance: instance,
    alloc: alloc$1,
    all: all,
    times: times,
    forMap: forMap$1,
    accurateTimeout: accurateTimeout,
    get: get$1,
    hasProperty: hasProperty,
    turn: turn$1,
    max: max,
    rand64: rand64,
    tokenize: tokenize,
    randRange: randRange,
    rangeModel: rangeModel,
    range: range,
    domainRangeValue: domainRangeValue,
    matrixRange: matrixRange,
    dateExp: dateExp,
    timestampExp: timestampExp,
    timescaleExp: timescaleExp,
    promise: promise,
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
    operate: operate
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
