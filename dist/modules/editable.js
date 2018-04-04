(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../functions", "lodash/get", "lodash/isEqual", "lodash/cloneDeep", "lodash/isPlainObject"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../functions"), require("lodash/get"), require("lodash/isEqual"), require("lodash/cloneDeep"), require("lodash/isPlainObject"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.functions, global.get, global.isEqual, global.cloneDeep, global.isPlainObject);
    global.editable = mod.exports;
  }
})(this, function (_exports, _functions, _get2, _isEqual2, _cloneDeep2, _isPlainObject2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.editable = _exports.beginEditable = _exports.changedEditable = _exports.commitEditable = _exports.cancleEditable = _exports.exitEditable = _exports.enterEditable = _exports.isEditable = void 0;
  _get2 = _interopRequireDefault(_get2);
  _isEqual2 = _interopRequireDefault(_isEqual2);
  _cloneDeep2 = _interopRequireDefault(_cloneDeep2);
  _isPlainObject2 = _interopRequireDefault(_isPlainObject2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /*
  var a = {name:"foo"}
  beginEditable(a)
  a // => {name:"foo", $editable:[{name:"foo"}]}
  */
  var EDITABLE_DEFAULT_KEY = "$editable";

  var isEditableModel = function isEditableModel(model) {
    return (0, _isPlainObject2.default)(model);
  };

  var isEditableState = function isEditableState(model) {
    return model[EDITABLE_DEFAULT_KEY] !== undefined;
  };

  var extendEditModel = function extendEditModel(model) {
    model[EDITABLE_DEFAULT_KEY] = [];
    return model;
  };

  var putEditModel = function putEditModel(destModel, setModel) {
    var putModel = (0, _cloneDeep2.default)(setModel);
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
    return (0, _cloneDeep2.default)(currentModelValues);
  };

  var pushEditModel = function pushEditModel(model, pushModel) {
    if (!isEditableState(model)) {
      extendEditModel(model);
    }

    var editableMeta = model[EDITABLE_DEFAULT_KEY];
    editableMeta.push(cloneCurrentModel(pushModel));
    return model;
  };

  var removeEditModel = function removeEditModel(model) {
    if (isEditableModel(model) && isEditableState(model)) {
      model[EDITABLE_DEFAULT_KEY] = undefined;
    }

    return model;
  };

  var getOriginalModel = function getOriginalModel(model) {
    return (0, _get2.default)(model, "[" + EDITABLE_DEFAULT_KEY + "][0]");
  };

  var getLastModel = function getLastModel(model) {
    var changeHistory = (0, _get2.default)(model, "[" + EDITABLE_DEFAULT_KEY + "]");
    return changeHistory && changeHistory[changeHistory.length - 1];
  };

  var _isEditable = function isEditable(model) {
    if (!isEditableModel(model)) return false;
    return isEditableState(model);
  };

  _exports.isEditable = _isEditable;

  var enterEditable = function enterEditable(model) {
    if (!isEditableModel(model)) return model;

    if (model[EDITABLE_DEFAULT_KEY] !== undefined) {
      return model;
    } else {
      return pushEditModel(model, model);
    }
  };

  _exports.enterEditable = enterEditable;

  var exitEditable = function exitEditable(model, extendModel) {
    if (extendModel === void 0) {
      extendModel = undefined;
    }

    if (!isEditableModel(model)) return model;

    if (isEditableModel(extendModel)) {
      var currentExtendModel = cloneCurrentModel(extendModel);
      Object.keys(currentExtendModel).forEach(function (key) {
        model[key] = currentExtendModel[key];
      });
    }

    removeEditModel(model);
    return model;
  };

  _exports.exitEditable = exitEditable;

  var cancleEditable = function cancleEditable(model) {
    if (!isEditableModel(model)) return model;
    var originalModel = getOriginalModel(model);
    removeEditModel(model);
    putEditModel(model, originalModel);
  };

  _exports.cancleEditable = cancleEditable;

  var commitEditable = function commitEditable(model) {
    if (!isEditableModel(model)) return model;
    return pushEditModel(model, model);
  };

  _exports.commitEditable = commitEditable;

  var changedEditable = function changedEditable(model) {
    if (!isEditableModel(model) || !_isEditable(model)) return false;
    return !(0, _isEqual2.default)(cloneCurrentModel(model), getLastModel(model));
  };

  _exports.changedEditable = changedEditable;

  var beginEditable = function beginEditable(model) {
    if (!isEditableModel(model)) return model;

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

  _exports.beginEditable = beginEditable;

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
      free: function free() {
        return (0, _functions.free)(model);
      },
      viewmodel: function viewmodel() {
        //ready for vue template binding
        if (!model.hasOwnProperty(EDITABLE_DEFAULT_KEY)) {
          model[EDITABLE_DEFAULT_KEY] = undefined;
        }

        return model;
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

  _exports.editable = editable;
});