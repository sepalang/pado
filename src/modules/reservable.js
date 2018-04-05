import { free } from '../functions'
import _get from 'lodash/get';
import _assign from 'lodash/assign';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import _isPlainObject from 'lodash/isPlainObject';

const RESERVABLE_DEFAULT_KEY = "$reservable";

// reservable 전환 가능한 타입인지 확인
const isReserePossibleModel = model=>_isPlainObject(model)

// reservable 상태인지
const isReservableState = model=>model[RESERVABLE_DEFAULT_KEY] !== undefined

// reservable 메타 모델을 적용
const reservableModelize = function(model, method="options",parameters={}){
  if(typeof method === "object"){
    method = "options";
    parameters = _assign({},parameters,method);
  }
  
  model[EDITABLE_DEFAULT_KEY] = {
    method,
    parameters
  };
  return model;
}

// reservable 상태로 변경합니다.
export const enterReservable = function(model,method,option={}){
  if(!isReserePossibleModel(model)) return model;
  if(model[RESERVABLE_DEFAULT_KEY] !== undefined){
    return model;
  } else {
    return pushEditModel(model,model);
  }
}

export const beginReservable = function(model){
  if(!isReserePossibleModel(model)) return model;
  if(!isReservableState(model)){
    enterReservable(model);
  } else {
    const historyMeta = model[RESERVABLE_DEFAULT_KEY];
    const beginModel  = historyMeta[0];
    
    historyMeta.splice(0,historyMeta.length,beginModel);
    setReserveModel(model,beginModel);
  }
  return model;
}

export const expandReservable = function(model){
  
}

export const reservations = function(data){
  
}

export const reservable = function(model){
  const reservableQuery = {
    //isReservable:()=>isReservable(model),
    //isChanged :()=>changedReservable(model),
    //output    :()=>cloneCurrentModel(model),
    free      :()=>free(model),
    expand:()=>{
      //ready for vue template binding
      if(!model.hasOwnProperty(RESERVABLE_DEFAULT_KEY)){
        model[RESERVABLE_DEFAULT_KEY] = undefined;
      }
      return model;
    },
    begin:(model,method,parameters)=>{
      beginReservable(model,method,parameters);
      return reservableQuery;
    },
    //enter:()=>{
    //  enterReservable(model);
    //  return reservableQuery;
    //},
    //exit:(extendModel=undefined)=>{
    //  exitReservable(model,extendModel)
    //  return reservableQuery;
    //},
    //cancle:()=>{
    //  cancleReservable(model)
    //  return reservableQuery;
    //},
    //commit:()=>{
    //  commitReservable(model)
    //  return reservableQuery;
    //}
  }
  
  return reservableQuery;
};