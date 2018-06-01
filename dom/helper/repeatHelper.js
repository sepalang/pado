(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.find", "core-js/modules/web.dom.iterable", "../../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.find"), require("core-js/modules/web.dom.iterable"), require("../../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.webDom, global.functions);
    global.repeatHelper = mod.exports;
  }
})(this, function (_exports, _es6Array, _webDom, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = RepeatHelper;

  function RepeatHelper(_ref) {
    var key = _ref.key,
        enterFn = _ref.enter,
        updateFn = _ref.update,
        exitFn = _ref.exit;
    // {key:string, vm:Component}
    var oldBag = []; // 모델의 키를 얻는 함수

    var getKey = typeof key === "function" ? key : function (datum) {
      return datum[key];
    }; // ng-repeat, v-for와 같은 리피터 구현체 (d3의 data().enter().exit() 컨샙이 비슷함)

    var repeater = function repeater(data) {
      var newData = (0, _functions.asArray)(data);
      var newBag = []; //새 데이터를 검사합니다.

      newData.forEach(function (datum, index) {
        //키를 추출합니다.
        var newDatumKey = getKey(datum) || index; //키 샘플입니다.

        var newMeta = {
          key: newDatumKey,
          datum: datum
        }; //매치되는 오래된 메타를 확인합니다.

        var matchOldMeta = oldBag.find(function (old) {
          return old.key === newDatumKey;
        }); //오래된 메타가 확인될 시

        if (matchOldMeta) {
          //exit를 하지 않고 살립니다.
          newMeta.vm = matchOldMeta.vm;
          matchOldMeta.$continue = true;
        }

        newBag.push(newMeta);
      }); //exit (require)

      oldBag.forEach(function (oldMeta) {
        if (!oldMeta.$continue) {
          exitFn(oldMeta);
        }
      }); //메타에 추가 정보 입력 (prevVm)

      newBag.forEach(function (newMeta, index) {
        var prevMeta = newBag[index - 1];

        if (prevMeta && prevMeta["vm"]) {
          newMeta["prevVm"] = prevMeta["vm"];
        }
      }); //enter (require)

      newBag.forEach(function (newMeta, index) {
        if (!newMeta.vm) {
          var result = enterFn(newMeta, index);

          if (!result) {
            throw new Error("enter는 반드시 vm을 리턴해야합니다.");
          } else {
            newMeta["vm"] = result;
          }
        }
      }); //update (option)

      updateFn && newBag.forEach(function (newMeta, index) {
        updateFn(newMeta, index);
      }); //history change

      oldBag = newBag;
    }; //컴포넌트에서 정렬된 데이터를 얻기위한 용도로 제작. Component에서 (개발 시간상) 한계로 이곳에서 수행


    repeater["vm"] = function () {
      return oldBag.map(function (d) {
        return d.vm;
      });
    };

    return repeater;
  }

  ;
});
//# sourceMappingURL=repeatHelper.js.map