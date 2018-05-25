(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/web.dom.iterable", "../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/web.dom.iterable"), require("../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Object, global.webDom, global.functions);
    global.editable = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Object, _webDom, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.editable = _exports.expandEditable = _exports.beginEditable = _exports.changedEditable = _exports.commitEditable = _exports.cancleEditable = _exports.exitEditable = _exports.enterEditable = _exports.isEditable = void 0;
  var EDITABLE_DEFAULT_KEY = "$editable";

  var isEditPossibleDataType = function isEditPossibleDataType(model) {
    return (0, _functions.isPlainObject)(model);
  };

  var isEditableState = function isEditableState(model) {
    return model[EDITABLE_DEFAULT_KEY] !== undefined;
  };

  var editableModelize = function editableModelize(model) {
    model[EDITABLE_DEFAULT_KEY] = [];
    return model;
  };

  var putEditModel = function putEditModel(destModel, setModel) {
    var putModel = (0, _functions.cloneDeep)(setModel);
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
    return (0, _functions.cloneDeep)(currentModelValues);
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
    return (0, _functions.get)(model, "[" + EDITABLE_DEFAULT_KEY + "][0]");
  };

  var getLastModel = function getLastModel(model) {
    var changeHistory = (0, _functions.get)(model, "[" + EDITABLE_DEFAULT_KEY + "]");
    return changeHistory && changeHistory[changeHistory.length - 1];
  };

  var _isEditable = function isEditable(model) {
    if (!isEditPossibleDataType(model)) return false;
    return isEditableState(model);
  };

  _exports.isEditable = _isEditable;

  var enterEditable = function enterEditable(model) {
    if (!isEditPossibleDataType(model)) return model;

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

  _exports.exitEditable = exitEditable;

  var cancleEditable = function cancleEditable(model) {
    if (!isEditPossibleDataType(model)) return model;
    var originalModel = getOriginalModel(model);
    removeEditModel(model);
    putEditModel(model, originalModel);
  };

  _exports.cancleEditable = cancleEditable;

  var commitEditable = function commitEditable(model) {
    if (!isEditPossibleDataType(model)) return model;
    return pushEditModel(model, model);
  };

  _exports.commitEditable = commitEditable;

  var changedEditable = function changedEditable(model) {
    if (!isEditPossibleDataType(model) || !_isEditable(model)) return false;
    return !(0, _functions.isEqual)(cloneCurrentModel(model), getLastModel(model));
  };

  _exports.changedEditable = changedEditable;

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

  _exports.beginEditable = beginEditable;

  var expandEditable = function expandEditable(model) {
    if (!model.hasOwnProperty(EDITABLE_DEFAULT_KEY)) {
      model[EDITABLE_DEFAULT_KEY] = undefined;
    }

    return model;
  };

  _exports.expandEditable = expandEditable;

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

  _exports.editable = editable;
});
//# sourceMappingURL=editable.js.map