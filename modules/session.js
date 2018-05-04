(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.promise", "core-js/modules/web.dom.iterable", "./promise"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.promise"), require("core-js/modules/web.dom.iterable"), require("./promise"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6, global.webDom, global.promise);
    global.session = mod.exports;
  }
})(this, function (_exports, _es, _webDom, _promise) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.session = void 0;
  var SESSION_STORE = {};
  var STATE_STORE = {};
  /*
  let idx = 0;
  session("scopeName").open((name)=>{ id:idx++, name });
  
  let { item, resolve } = await session("scopeName").spawn("bob");
  resolve(item);
  
  let { item, resolve } = await session("scopeName").spawn("cat");
  resolve(item);
  
  session("scopeName").close()
  */

  var session = function session(name) {
    var inst = {
      outputs: function outputs() {
        return STATE_STORE[name].map(function (e) {
          return e.output;
        });
      },
      open: function open(fn) {
        SESSION_STORE[name] = fn;
        STATE_STORE[name] = [];
      },
      close: function close() {
        var result = inst.outputs();
        delete SESSION_STORE[name];
        delete STATE_STORE[name];
        return Promise.all(result);
      },
      spawn: function spawn(payload) {
        if (typeof SESSION_STORE[name] !== "function") {
          if (!SESSION_STORE[name]) {
            throw new Error("session:: " + name + " is not defined");
          } else {
            throw new Error("session:: " + name + " is not function callback");
          }
        }

        var input = _promise.promise.valueOf(SESSION_STORE[name](payload));

        var managedSpawn = {
          input: input,
          output: undefined,
          item: undefined
        };
        return input.then(function (item) {
          var deferred = _promise.promise.defer();

          var deferPromise = deferred.promise;
          managedSpawn.output = deferPromise;
          managedSpawn.item = item;
          STATE_STORE[name].push(managedSpawn);
          return {
            item: item,
            resolve: deferred.resolve,
            reject: deferred.reject
          };
        });
      }
    };
    return inst;
  };

  _exports.session = session;
});
//# sourceMappingURL=session.js.map