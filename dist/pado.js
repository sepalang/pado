(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.module = factory());
}(this, (function () { 'use strict';

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

  function _readOnlyError(name) {
    throw new Error("\"" + name + "\" is read-only");
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

  var require$$0 = /*#__PURE__*/Object.freeze({

  });

  var _fixReWks = function (KEY, length, exec) {
    var SYMBOL = require$$0(KEY);
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

  var wks = require('./_wks');

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
  var HIDDEN = wks('_hidden');
  var TO_PRIMITIVE = wks('toPrimitive');
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
      return wrap(wks(name));
    };
  }

  $export$2($export$2.G + $export$2.W + $export$2.F * !USE_NATIVE, {
    Symbol: $Symbol
  });

  for (var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
    wks(es6Symbols[j++]);
  }

  for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) {
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

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */


  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = _freeGlobal || freeSelf || Function('return this')();
  var _root = root;

  /** Built-in value references. */


  var Symbol$2 = _root.Symbol;
  var _Symbol = Symbol$2;

  /** Used for built-in method references. */


  var objectProto = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto.toString;
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
    var isOwn = hasOwnProperty.call(value, symToStringTag),
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
  var objectProto$1 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$1.toString;
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

  /** Built-in value references. */


  var getPrototype = _overArg(Object.getPrototypeOf, Object);
  var _getPrototype = getPrototype;

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

  /** Used for built-in method references. */

  var funcProto = Function.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString.call(Object);

  var isAbsoluteNaN = function isAbsoluteNaN(number) {
    return number !== number && typeof number === "number";
  };
  var isNone = function isNone(data) {
    return isAbsoluteNaN(data) || data === undefined || data === null;
  };
  var isNumber = function isNumber() {
    return typeof num === "number" && !isAbsoluteNaN(num);
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
  var notExsist = notExsist = (_readOnlyError("notExsist"), function (value) {
    return !isExsist(value);
  });

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

  var isFunction$1 = require('./isFunction'),
      isMasked = require('./_isMasked'),
      isObject$2 = require('./isObject'),
      toSource = require('./_toSource');
  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */


  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Used for built-in method references. */

  var funcProto$1 = Function.prototype,
      objectProto$3 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$1 = funcProto$1.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */

  function baseIsNative(value) {
    if (!isObject$2(value) || isMasked(value)) {
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

  /* Built-in method references that are verified to be native. */


  var Map$1 = _getNative(_root, 'Map');
  var _Map = Map$1;

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

  var objectProto$4 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
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

    return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */


  var objectProto$5 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
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
    return _nativeCreate ? data[key] !== undefined : hasOwnProperty$4.call(data, key);
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

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }

    return array;
  }

  var _arrayEach = arrayEach;

  var defineProperty = function () {
    try {
      var func = _getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }();

  var _defineProperty$1 = defineProperty;

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */


  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && _defineProperty$1) {
      _defineProperty$1(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  var _baseAssignValue = baseAssignValue;

  /** Used for built-in method references. */


  var objectProto$6 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */

  function assignValue(object, key, value) {
    var objValue = object[key];

    if (!(hasOwnProperty$5.call(object, key) && eq_1(objValue, value)) || value === undefined && !(key in object)) {
      _baseAssignValue(object, key, value);
    }
  }

  var _assignValue = assignValue;

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */


  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }

      if (isNew) {
        _baseAssignValue(object, key, newValue);
      } else {
        _assignValue(object, key, newValue);
      }
    }

    return object;
  }

  var _copyObject = copyObject;

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


  var objectProto$7 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
  /** Built-in value references. */

  var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;
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
    return isObjectLike_1(value) && hasOwnProperty$6.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
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

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;
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
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }

  var _isIndex = isIndex;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
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
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  var isLength_1 = isLength;

  /** `Object#toString` result references. */


  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag$1 = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
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
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
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

  /** Used for built-in method references. */


  var objectProto$8 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
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

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */

  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$9;
    return value === proto;
  }

  var _isPrototype = isPrototype;

  /* Built-in method references for those with the same name as other `lodash` methods. */


  var nativeKeys = _overArg(Object.keys, Object);
  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */


  var objectProto$10 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$8 = objectProto$10.hasOwnProperty;
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
      if (hasOwnProperty$8.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }

  var _baseKeys = baseKeys;

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
  function isObject$3(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject$3;

  /** `Object#toString` result references. */


  var asyncTag = '[object AsyncFunction]',
      funcTag$1 = '[object Function]',
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
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction$2;

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
   * The base implementation of `_.assign` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */


  function baseAssign(object, source) {
    return object && _copyObject(source, keys_1(source), object);
  }

  var _baseAssign = baseAssign;

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];

    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }

    return result;
  }

  var _nativeKeysIn = nativeKeysIn;

  /** Used for built-in method references. */


  var objectProto$11 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$9 = objectProto$11.hasOwnProperty;
  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */

  function baseKeysIn(object) {
    if (!isObject_1(object)) {
      return _nativeKeysIn(object);
    }

    var isProto = _isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$9.call(object, key)))) {
        result.push(key);
      }
    }

    return result;
  }

  var _baseKeysIn = baseKeysIn;

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
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
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */


  function keysIn$1(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
  }

  var keysIn_1 = keysIn$1;

  /**
   * The base implementation of `_.assignIn` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */


  function baseAssignIn(object, source) {
    return object && _copyObject(source, keysIn_1(source), object);
  }

  var _baseAssignIn = baseAssignIn;

  var _cloneBuffer = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */


  var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Built-in value references. */

  var Buffer = moduleExports ? _root.Buffer : undefined,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */

  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }

    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }

  module.exports = cloneBuffer;
  });

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;
    array || (array = Array(length));

    while (++index < length) {
      array[index] = source[index];
    }

    return array;
  }

  var _copyArray = copyArray;

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


  var objectProto$12 = Object.prototype;
  /** Built-in value references. */

  var propertyIsEnumerable$1 = objectProto$12.propertyIsEnumerable;
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
   * Copies own symbols of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */


  function copySymbols(source, object) {
    return _copyObject(source, _getSymbols(source), object);
  }

  var _copySymbols = copySymbols;

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

  /* Built-in method references for those with the same name as other `lodash` methods. */


  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
  /**
   * Creates an array of the own and inherited enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */

  var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function (object) {
    var result = [];

    while (object) {
      _arrayPush(result, _getSymbols(object));
      object = _getPrototype(object);
    }

    return result;
  };
  var _getSymbolsIn = getSymbolsIn;

  /**
   * Copies own and inherited symbols of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */


  function copySymbolsIn(source, object) {
    return _copyObject(source, _getSymbolsIn(source), object);
  }

  var _copySymbolsIn = copySymbolsIn;

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

  /**
   * Creates an array of own and inherited enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function getAllKeysIn(object) {
    return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
  }

  var _getAllKeysIn = getAllKeysIn;

  /* Built-in method references that are verified to be native. */


  var DataView = _getNative(_root, 'DataView');
  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */


  var Promise$1 = _getNative(_root, 'Promise');
  var _Promise = Promise$1;

  /* Built-in method references that are verified to be native. */


  var Set = _getNative(_root, 'Set');
  var _Set = Set;

  /* Built-in method references that are verified to be native. */


  var WeakMap = _getNative(_root, 'WeakMap');
  var _WeakMap = WeakMap;

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$2 = funcProto$2.toString;
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
        return funcToString$2.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }

  var _toSource = toSource$1;

  /** `Object#toString` result references. */


  var mapTag$1 = '[object Map]',
      objectTag$2 = '[object Object]',
      promiseTag = '[object Promise]',
      setTag$1 = '[object Set]',
      weakMapTag$1 = '[object WeakMap]';
  var dataViewTag$1 = '[object DataView]';
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

  if (_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1 || _Map && getTag(new _Map()) != mapTag$1 || _Promise && getTag(_Promise.resolve()) != promiseTag || _Set && getTag(new _Set()) != setTag$1 || _WeakMap && getTag(new _WeakMap()) != weakMapTag$1) {
    getTag = function getTag(value) {
      var result = _baseGetTag(value),
          Ctor = result == objectTag$2 ? value.constructor : undefined,
          ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$1;

          case mapCtorString:
            return mapTag$1;

          case promiseCtorString:
            return promiseTag;

          case setCtorString:
            return setTag$1;

          case weakMapCtorString:
            return weakMapTag$1;
        }
      }

      return result;
    };
  }

  var _getTag = getTag;

  /** Used for built-in method references. */
  var objectProto$13 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$10 = objectProto$13.hasOwnProperty;
  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */

  function initCloneArray(array) {
    var length = array.length,
        result = new array.constructor(length); // Add properties assigned by `RegExp#exec`.

    if (length && typeof array[0] == 'string' && hasOwnProperty$10.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }

    return result;
  }

  var _initCloneArray = initCloneArray;

  /** Built-in value references. */


  var Uint8Array = _root.Uint8Array;
  var _Uint8Array = Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */


  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
    return result;
  }

  var _cloneArrayBuffer = cloneArrayBuffer;

  /**
   * Creates a clone of `dataView`.
   *
   * @private
   * @param {Object} dataView The data view to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned data view.
   */


  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }

  var _cloneDataView = cloneDataView;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;
  /**
   * Creates a clone of `regexp`.
   *
   * @private
   * @param {Object} regexp The regexp to clone.
   * @returns {Object} Returns the cloned regexp.
   */

  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }

  var _cloneRegExp = cloneRegExp;

  /** Used to convert symbols to primitives and strings. */


  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  /**
   * Creates a clone of the `symbol` object.
   *
   * @private
   * @param {Object} symbol The symbol object to clone.
   * @returns {Object} Returns the cloned symbol object.
   */

  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }

  var _cloneSymbol = cloneSymbol;

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */


  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  var _cloneTypedArray = cloneTypedArray;

  /** `Object#toString` result references. */


  var boolTag$1 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      mapTag$2 = '[object Map]',
      numberTag$1 = '[object Number]',
      regexpTag$1 = '[object RegExp]',
      setTag$2 = '[object Set]',
      stringTag$1 = '[object String]',
      symbolTag = '[object Symbol]';
  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$2 = '[object DataView]',
      float32Tag$1 = '[object Float32Array]',
      float64Tag$1 = '[object Float64Array]',
      int8Tag$1 = '[object Int8Array]',
      int16Tag$1 = '[object Int16Array]',
      int32Tag$1 = '[object Int32Array]',
      uint8Tag$1 = '[object Uint8Array]',
      uint8ClampedTag$1 = '[object Uint8ClampedArray]',
      uint16Tag$1 = '[object Uint16Array]',
      uint32Tag$1 = '[object Uint32Array]';
  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */

  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;

    switch (tag) {
      case arrayBufferTag$1:
        return _cloneArrayBuffer(object);

      case boolTag$1:
      case dateTag$1:
        return new Ctor(+object);

      case dataViewTag$2:
        return _cloneDataView(object, isDeep);

      case float32Tag$1:
      case float64Tag$1:
      case int8Tag$1:
      case int16Tag$1:
      case int32Tag$1:
      case uint8Tag$1:
      case uint8ClampedTag$1:
      case uint16Tag$1:
      case uint32Tag$1:
        return _cloneTypedArray(object, isDeep);

      case mapTag$2:
        return new Ctor();

      case numberTag$1:
      case stringTag$1:
        return new Ctor(object);

      case regexpTag$1:
        return _cloneRegExp(object);

      case setTag$2:
        return new Ctor();

      case symbolTag:
        return _cloneSymbol(object);
    }
  }

  var _initCloneByTag = initCloneByTag;

  /** Built-in value references. */


  var objectCreate = Object.create;
  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */

  var baseCreate = function () {
    function object() {}

    return function (proto) {
      if (!isObject_1(proto)) {
        return {};
      }

      if (objectCreate) {
        return objectCreate(proto);
      }

      object.prototype = proto;
      var result = new object();
      object.prototype = undefined;
      return result;
    };
  }();

  var _baseCreate = baseCreate;

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */


  function initCloneObject(object) {
    return typeof object.constructor == 'function' && !_isPrototype(object) ? _baseCreate(_getPrototype(object)) : {};
  }

  var _initCloneObject = initCloneObject;

  /** `Object#toString` result references. */


  var mapTag$3 = '[object Map]';
  /**
   * The base implementation of `_.isMap` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   */

  function baseIsMap(value) {
    return isObjectLike_1(value) && _getTag(value) == mapTag$3;
  }

  var _baseIsMap = baseIsMap;

  /* Node.js helper references. */


  var nodeIsMap = _nodeUtil && _nodeUtil.isMap;
  /**
   * Checks if `value` is classified as a `Map` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   * @example
   *
   * _.isMap(new Map);
   * // => true
   *
   * _.isMap(new WeakMap);
   * // => false
   */

  var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;
  var isMap_1 = isMap;

  /** `Object#toString` result references. */


  var setTag$3 = '[object Set]';
  /**
   * The base implementation of `_.isSet` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a set, else `false`.
   */

  function baseIsSet(value) {
    return isObjectLike_1(value) && _getTag(value) == setTag$3;
  }

  var _baseIsSet = baseIsSet;

  /* Node.js helper references. */


  var nodeIsSet = _nodeUtil && _nodeUtil.isSet;
  /**
   * Checks if `value` is classified as a `Set` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a set, else `false`.
   * @example
   *
   * _.isSet(new Set);
   * // => true
   *
   * _.isSet(new WeakSet);
   * // => false
   */

  var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;
  var isSet_1 = isSet;

  /** Used to compose bitmasks for cloning. */


  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;
  /** `Object#toString` result references. */

  var argsTag$2 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      boolTag$2 = '[object Boolean]',
      dateTag$2 = '[object Date]',
      errorTag$1 = '[object Error]',
      funcTag$2 = '[object Function]',
      genTag$1 = '[object GeneratorFunction]',
      mapTag$4 = '[object Map]',
      numberTag$2 = '[object Number]',
      objectTag$3 = '[object Object]',
      regexpTag$2 = '[object RegExp]',
      setTag$4 = '[object Set]',
      stringTag$2 = '[object String]',
      symbolTag$1 = '[object Symbol]',
      weakMapTag$2 = '[object WeakMap]';
  var arrayBufferTag$2 = '[object ArrayBuffer]',
      dataViewTag$3 = '[object DataView]',
      float32Tag$2 = '[object Float32Array]',
      float64Tag$2 = '[object Float64Array]',
      int8Tag$2 = '[object Int8Array]',
      int16Tag$2 = '[object Int16Array]',
      int32Tag$2 = '[object Int32Array]',
      uint8Tag$2 = '[object Uint8Array]',
      uint8ClampedTag$2 = '[object Uint8ClampedArray]',
      uint16Tag$2 = '[object Uint16Array]',
      uint32Tag$2 = '[object Uint32Array]';
  /** Used to identify `toStringTag` values supported by `_.clone`. */

  var cloneableTags = {};
  cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] = cloneableTags[boolTag$2] = cloneableTags[dateTag$2] = cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] = cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] = cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] = cloneableTags[numberTag$2] = cloneableTags[objectTag$3] = cloneableTags[regexpTag$2] = cloneableTags[setTag$4] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] = cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
  cloneableTags[errorTag$1] = cloneableTags[funcTag$2] = cloneableTags[weakMapTag$2] = false;
  /**
   * The base implementation of `_.clone` and `_.cloneDeep` which tracks
   * traversed objects.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Deep clone
   *  2 - Flatten inherited properties
   *  4 - Clone symbols
   * @param {Function} [customizer] The function to customize cloning.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The parent object of `value`.
   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
   * @returns {*} Returns the cloned value.
   */

  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result,
        isDeep = bitmask & CLONE_DEEP_FLAG,
        isFlat = bitmask & CLONE_FLAT_FLAG,
        isFull = bitmask & CLONE_SYMBOLS_FLAG;

    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }

    if (result !== undefined) {
      return result;
    }

    if (!isObject_1(value)) {
      return value;
    }

    var isArr = isArray_1(value);

    if (isArr) {
      result = _initCloneArray(value);

      if (!isDeep) {
        return _copyArray(value, result);
      }
    } else {
      var tag = _getTag(value),
          isFunc = tag == funcTag$2 || tag == genTag$1;

      if (isBuffer_1(value)) {
        return _cloneBuffer(value, isDeep);
      }

      if (tag == objectTag$3 || tag == argsTag$2 || isFunc && !object) {
        result = isFlat || isFunc ? {} : _initCloneObject(value);

        if (!isDeep) {
          return isFlat ? _copySymbolsIn(value, _baseAssignIn(result, value)) : _copySymbols(value, _baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }

        result = _initCloneByTag(value, tag, isDeep);
      }
    } // Check for circular references and return its corresponding clone.


    stack || (stack = new _Stack());
    var stacked = stack.get(value);

    if (stacked) {
      return stacked;
    }

    stack.set(value, result);

    if (isSet_1(value)) {
      value.forEach(function (subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
      return result;
    }

    if (isMap_1(value)) {
      value.forEach(function (subValue, key) {
        result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    var keysFunc = isFull ? isFlat ? _getAllKeysIn : _getAllKeys : isFlat ? keysIn : keys_1;
    var props = isArr ? undefined : keysFunc(value);
    _arrayEach(props || value, function (subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      } // Recursively populate clone (susceptible to call stack limits).


      _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
    return result;
  }

  var _baseClone = baseClone;

  /** Used to compose bitmasks for cloning. */


  var CLONE_DEEP_FLAG$1 = 1,
      CLONE_SYMBOLS_FLAG$1 = 4;
  /**
   * This method is like `_.clone` except that it recursively clones `value`.
   *
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category Lang
   * @param {*} value The value to recursively clone.
   * @returns {*} Returns the deep cloned value.
   * @see _.clone
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var deep = _.cloneDeep(objects);
   * console.log(deep[0] === objects[0]);
   * // => false
   */

  function cloneDeep$1(value) {
    return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
  }

  var cloneDeep_1 = cloneDeep$1;

  var cloneDeep$2 = _.cloneDeep;

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

  var FUNCTION_EXPORTS$1 = {};

  var UNIQUE = FUNCTION_EXPORTS$1.UNIQUE = function (array) {
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

  var HAS_VALUE = FUNCTION_EXPORTS$1.HAS_VALUE = function () {
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
        return (useLeftSelector ? get(object, leftSelect) : object) === (useRightSelector ? get(value, rightSelect) : value);
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

  var GET_KEY_BY = FUNCTION_EXPORTS$1.GET_KEY_BY = function (object, value) {
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

  var STRING_CAST = FUNCTION_EXPORTS$1.STRING_CAST = function () {
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


  var FIND_INDEXES = FUNCTION_EXPORTS$1.FIND_INDEXES = function () {
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

  var EACH_PROC = FUNCTION_EXPORTS$1.EACH_PROC = function (arr, proc) {
    if (arr.length > 1) {
      for (var i = 0, l = arr.length - 1; i < l; proc(arr[i], i, false), i++) {
      }

      proc(arr[arr.length - 1], arr.length - 1, true);
    } else if (arr.length == 1) {
      proc(arr[0], 0, true);
    }

    return arr;
  };

  var STATIC_FOR_EACH_PROC = FUNCTION_EXPORTS$1.STATIC_FOR_EACH_PROC = function (obj, proc) {
    if (typeof obj === "object") for (var i = 0, a = obj instanceof Array, al = a ? obj.length : NaN, keys = Object.keys(obj), l = keys.length; i < l; proc(obj[keys[i]], keys[i], i, l, al), i++) {
    }
    return obj;
  };

  var FREE = FUNCTION_EXPORTS$1.FREE = function (datum) {
    var dest = {};
    Object.keys(datum).forEach(function (key) {
      if (!/^\$/.test(key)) {
        dest[key] = cloneDeep_1(datum[key]);
      }
    });
    return dest;
  };

  var EACH = function EACH(value, proc) {
    return EACH_PROC(asArray$1(value), proc);
  };

  var REDUCE = function REDUCE(value, proc, meta) {
    value = asArray$1(value);
    return EACH_PROC(value, function (v, i, l) {
      meta = proc(meta, v, i, l);
    }), meta;
  }; //PINPONGPOOL TRANSFORM


  var REMOVE_VALUE = FUNCTION_EXPORTS$1.REMOVE_VALUE = function (obj, value) {
    var detect = true;
    var array = isArray$1(obj);

    while (detect) {
      var key = GET_KEY_BY(obj, value);

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

  var CLEAR_OF = FUNCTION_EXPORTS$1.CLEAR_OF = function (data, fillFn, sp) {
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

  var INSERT_OF = FUNCTION_EXPORTS$1.INSERT_OF = function (data, v, a) {
    isArray$1(data) && data.splice(typeof a === "number" ? a : 0, 0, v);
    return data;
  };

  var MOVE_OF = FUNCTION_EXPORTS$1.MOVE_OF = function (data, oldIndex, newIndex) {
    if (oldIndex !== newIndex && isArray$1(data) && typeof oldIndex === "number" && typeof newIndex === "number" && oldIndex >= 0 && oldIndex < data.length) {
      Array.prototype.splice.call(data, newIndex > data.length ? data.length : newIndex, 0, Array.prototype.splice.call(data, oldIndex, 1)[0]);
    }

    return data;
  };

  var CONCAT_OF = FUNCTION_EXPORTS$1.CONCAT_OF = function (data, appends) {
    var data = asArray$1(data);
    return EACH(appends, function (value) {
      data.push(value);
    }), data;
  };

  var FILTER_OF = FUNCTION_EXPORTS$1.FILTER_OF = function (data, func, exitFn) {
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

  var SORT_OF = FUNCTION_EXPORTS$1.SORT_OF = function (data, filter) {
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

  var REBASE = FUNCTION_EXPORTS$1.REBASE = function (obj, ref) {
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


  var NESTED_HAS_PROC = FUNCTION_EXPORTS$1.NESTED_HAS_PROC = function (obj, key) {
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

  var APART = FUNCTION_EXPORTS$1.APART = function (text, split, block, blockEnd) {
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

  var DIFF_STRUCTURE = FUNCTION_EXPORTS$1.DIFF_STRUCTURE = function (before, after) {
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

        if (canDiff && !angular.equals(get(after, key), get(before, key))) {
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


  var TOGGLE = FUNCTION_EXPORTS$1.TOGGLE = function (ta, cv, set) {
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

  var TRUN = FUNCTION_EXPORTS$1.TRUN = function (i, p, ts) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = p - (abs > p ? abs % p : abs);
    }
    ts = ts ? ts : 1;
    i = Math.floor(i / ts);
    return p > i ? i : i % p;
  };

  var FINALLY_EXPORTS = Object.keys(FUNCTION_EXPORTS$1).reduce(function (dest, key) {
    var camelKey = key.toLowerCase().replace(/\_[\w]/g, function (s) {
      return s.substr(1).toUpperCase();
    });
    dest[camelKey] = FUNCTION_EXPORTS$1[key];
    return dest;
  }, {});
  module.exports = _objectSpread({}, FINALLY_EXPORTS);

  var functions = /*#__PURE__*/Object.freeze({

  });

  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = require$$0('unscopables');

  var ArrayProto = Array.prototype;
  if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});

  var _addToUnscopables = function (key) {
    ArrayProto[UNSCOPABLES][key] = true;
  };

  var _iterStep = function (done, value) {
    return {
      value: value,
      done: !!done
    };
  };

  var _iterators = {};

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

  var $export$4 = require('./_export');

  var redefine$3 = require('./_redefine');

  var hide$2 = require('./_hide');

  var has$2 = require('./_has');

  var Iterators = require('./_iterators');

  var $iterCreate = require('./_iter-create');

  var setToStringTag$1 = require('./_set-to-string-tag');

  var getPrototypeOf = require('./_object-gpo');

  var ITERATOR = require('./_wks')('iterator');

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
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = !BUGGY && $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype; // Fix native

    if ($anyNative) {
      IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));

      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        setToStringTag$1(IteratorPrototype, TAG, true); // fix for some old engines

        if (!LIBRARY && !has$2(IteratorPrototype, ITERATOR)) hide$2(IteratorPrototype, ITERATOR, returnThis);
      }
    } // fix Array#{values, @@iterator}.name in V8 / FF


    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;

      $default = function values() {
        return $native.call(this);
      };
    } // Define iterator


    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      hide$2(proto, ITERATOR, $default);
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
      } else $export$4($export$4.P + $export$4.F * (BUGGY || VALUES_BUG), NAME, methods);
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

  var hasOwnProperty$11 = {}.hasOwnProperty;

  var _has = function (it, key) {
    return hasOwnProperty$11.call(it, key);
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

  var max$1 = Math.max;
  var min$1 = Math.min;

  var _toAbsoluteIndex = function (index, length) {
    index = _toInteger(index);
    return index < 0 ? max$1(index + length, 0) : min$1(index, length);
  };

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

  var ITERATOR$1 = require$$0('iterator');
  var TO_STRING_TAG = require$$0('toStringTag');
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
      if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
      if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME$1);
      _iterators[NAME$1] = ArrayValues;
      if (explicit) for (key in es6_array_iterator) {
        if (!proto[key]) redefine(proto, key, es6_array_iterator[key], true);
      }
    }
  }

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

  var toString = {}.toString;

  var _cof = function (it) {
    return toString.call(it).slice(8, -1);
  };

  // getting tag from 19.1.3.6 Object.prototype.toString()


  var TAG = require$$0('toStringTag'); // ES3 wrong here


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

  // check on default Array iterator


  var ITERATOR$2 = require$$0('iterator');

  var ArrayProto$1 = Array.prototype;

  var _isArrayIter = function (it) {
    return it !== undefined && (_iterators.Array === it || ArrayProto$1[ITERATOR$2] === it);
  };

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = {
    version: '2.5.3'
  };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var ITERATOR$3 = require$$0('iterator');



  var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$3] || it['@@iterator'] || _iterators[_classof(it)];
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




  var SPECIES = require$$0('species');

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

  var def = _objectDp.f;



  var TAG$1 = require$$0('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, {
      configurable: true,
      value: tag
    });
  };

  var SPECIES$1 = require$$0('species');

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

  var $export$5 = require('./_export');

  var toObject$1 = require('./_to-object');

  var call = require('./_iter-call');

  var isArrayIter = require('./_is-array-iter');

  var toLength = require('./_to-length');

  var createProperty = require('./_create-property');

  var getIterFn = require('./core.get-iterator-method');

  $export$5($export$5.S + $export$5.F * !require('./_iter-detect')(function (iter) {
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

  var ITERATOR$4 = require('./_wks')('iterator');

  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$4]();

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
      var iter = arr[ITERATOR$4]();

      iter.next = function () {
        return {
          done: safe = true
        };
      };

      arr[ITERATOR$4] = function () {
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

      var FakePromise = (promise.constructor = {})[require$$0('species')] = function (exec) {
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
        var result, then;

        try {
          if (handler) {
            if (!ok) {
              if (promise._h == 2) onHandleUnhandled(promise);
              promise._h = 1;
            }

            if (handler === true) result = value;else {
              if (domain) domain.enter();
              result = handler(value);
              if (domain) domain.exit();
            }

            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (e) {
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

  var domainRangeValue = FUNCTION_EXPORTS.DOMAIN_RANGE_VALUE = function (domain, range, vs, nice) {
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

  var isMaybePromise = function isMaybePromise(target) {
    return typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function";
  };

  var resolveFn = PromiseClass.resolve;
  var rejectFn = PromiseClass.reject;

  var PromiseFunction = function (PromiseClass) {
    return new PromiseClass(function (r, c) {
      var maybeAwaiter = fn(r, c);
      isMaybePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
    });
  }(Promise);

  var PromiseExports = {};
  PromiseExports.all = Promise.all;
  PromiseExports.resolve = resolveFn;
  PromiseExports.reject = rejectFn;

  PromiseExports.timeout = function (fn, time) {
    if (typeof fn === "number") {
      return q(function (resolve) {
        return setTimeout(function () {
          return resolve(time);
        }, fn);
      });
    } else {
      return q(function (resolve) {
        return setTimeout(function () {
          return resolve(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };

  PromiseExports.valueOf = function (maybeQ) {
    return q(function (resolve, reject) {
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

  PromiseExports.abort = function (notifyConsole) {
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

  PromiseExports.defer = function () {
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

  PromiseExports.wheel = function (tasks, option) {
    if (!(tasks instanceof Array)) {
      return q.reject(new Error("tasks must be array"));
    }

    if (!tasks.length || !tasks.some(function (e) {
      return typeof e === "function";
    })) {
      return q.reject(new Error("not found wheel executable"));
    }

    if (!tasks.some(function (e) {
      return typeof e !== "function" || typeof e !== "number";
    })) {
      return q.reject(new Error("wheel task only function or number executable"));
    }

    if (typeof option !== "object") {
      option = {};
    }

    var finished = false;
    var defer = q.defer();
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
      if (finished === null) return q.abort();
      finished = true;
      return e;
    }).catch(function (e) {
      if (finished === null) return q.abort();
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

  Object.keys(PromiseExports).forEach(function (key) {
    PromiseFunction[key] = PromiseExports[key];
  });
  module.exports = PromiseExports;
  var promise = PromiseFunction;

  module.exports = _objectSpread({}, functions, {
    promise: promise
  });

  var functions$1 = /*#__PURE__*/Object.freeze({

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
  var DEFAULT = BowFactory(_objectSpread({}, functions$1));
  var factory = BowFactory;

  var DEFAULT$1 = factory(_objectSpread({}, functions$1));

  return DEFAULT$1;

})));
//# sourceMappingURL=pado.js.map
