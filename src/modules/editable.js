import { free } from '../functions'
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import _isPlainObject from 'lodash/isPlainObject';

/*
var a = {name:"foo"}
beginEditable(a)
a // => {name:"foo", $editable:[{name:"foo"}]}
*/

const EDITABLE_DEFAULT_KEY = "$editable";

const isEditableModel = model=>_isPlainObject(model)

const isEditableState = model=>model[EDITABLE_DEFAULT_KEY] !== undefined

const extendEditModel = function(model){
  model[EDITABLE_DEFAULT_KEY] = [];
  return model;
}

const putEditModel = function(destModel, setModel){
  const putModel = _cloneDeep(setModel);
  
  Object.keys(destModel).forEach(key=>{
    if(key !== EDITABLE_DEFAULT_KEY){
      destModel[key] = undefined;
    }
  });

  Object.keys(putModel).forEach(key=>{
    if(key !== EDITABLE_DEFAULT_KEY){
      destModel[key] = putModel[key];
    }
  });
  
  return destModel;
};

const cloneCurrentModel = function(model){
  const currentModelValues = {};
  Object.keys(model).forEach(key=>{
    if(key !== EDITABLE_DEFAULT_KEY){
      currentModelValues[key] = model[key];
    }
  });
  return _cloneDeep(currentModelValues);
}

const pushEditModel = function(model,pushModel){
  if(!isEditableState(model)){
    extendEditModel(model)
  }
  const editableMeta = model[EDITABLE_DEFAULT_KEY];
  editableMeta.push(cloneCurrentModel(pushModel));
  return model;
}

const removeEditModel = function(model){
  if(isEditableModel(model) && isEditableState(model)){
    model[EDITABLE_DEFAULT_KEY] = undefined;
  }
  return model
}

const getOriginalModel = function(model){
  return _get(model,`[${EDITABLE_DEFAULT_KEY}][0]`);
}

const getLastModel = function(model){
  const changeHistory = _get(model,`[${EDITABLE_DEFAULT_KEY}]`);
  return changeHistory && changeHistory[changeHistory.length - 1];
}

export const isEditable = function(model){
  if(!isEditableModel(model)) return false;
  return isEditableState(model);
}

export const enterEditable = function(model){
  if(!isEditableModel(model)) return model;
  if(model[EDITABLE_DEFAULT_KEY] !== undefined){
    return model;
  } else {
    return pushEditModel(model,model);
  }
}

export const exitEditable = function(model, extendModel=undefined){
  if(!isEditableModel(model)) return model;
  if(isEditableModel(extendModel)){
    const currentExtendModel = cloneCurrentModel(extendModel);
    Object.keys(currentExtendModel).forEach(key=>{
      model[key] = currentExtendModel[key]
    });
  }
  removeEditModel(model);
  return model;
}

export const cancleEditable = function(model){
  if(!isEditableModel(model)) return model;
  const originalModel = getOriginalModel(model);
  removeEditModel(model);
  putEditModel(model, originalModel);
}

export const commitEditable = function(model){
  if(!isEditableModel(model)) return model;
  return pushEditModel(model,model);
}

export const changedEditable = function(model){
  if(!isEditableModel(model) || !isEditable(model)) return false;
  return !_isEqual(cloneCurrentModel(model),getLastModel(model));
}

export const beginEditable = function(model){
  if(!isEditableModel(model)) return model;
  if(!isEditableState(model)){
    enterEditable(model);
  } else {
    const historyMeta = model[EDITABLE_DEFAULT_KEY];
    const beginModel  = historyMeta[0];
    
    historyMeta.splice(0,historyMeta.length,beginModel);
    putEditModel(model,beginModel);
  }
  return model;
}

export const editable = function(model){
  const editableQuery = {
    isEditable:()=>isEditable(model),
    isChanged :()=>changedEditable(model),
    output    :()=>cloneCurrentModel(model),
    free      :()=>free(model),
    viewmodel:()=>{
      //ready for vue template binding
      if(!model.hasOwnProperty(EDITABLE_DEFAULT_KEY)){
        model[EDITABLE_DEFAULT_KEY] = undefined;
      }
      return model;
    },
    begin:()=>{
      beginEditable(model)
      return editableQuery;
    },
    enter:()=>{
      enterEditable(model);
      return editableQuery;
    },
    exit:(extendModel=undefined)=>{
      exitEditable(model,extendModel)
      return editableQuery;
    },
    cancle:()=>{
      cancleEditable(model)
      return editableQuery;
    },
    commit:()=>{
      commitEditable(model)
      return editableQuery;
    }
  }
  
  return editableQuery;
};