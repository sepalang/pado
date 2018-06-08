import { asArray } from '../functions'
import { timescaleExp } from '../functions/datetime'

// 데이터를 배열로 지니고 있음
// 데이터마다 간격과 속성만 지니고 있음 (시작시간은 없음)

const TimeProperties = function(fps){
  this._source = [];
  this._status = {
    timeStart:0,
    timeEnd  :0
  };
  this._fps = 30;
  this._tick  = 0;
  this._rate  = 0;
  this._wheel = null;
  this._rightDirection = true;
  
  this.fps = fps;
};

const TimePropertiesPrototype = {
  emit:function(){
    
  },
  on:function(){
    
  }
};
Object.defineProperties = {
  fps:{
    set(fps){
      this._fps     = (typeof fps === "number") ? fps : this._fps;
    },
    get(){
      return this._fps
    };
  },
  _interval(){
    get (){
      return 1000 / this._fps;
    }
  }
}

TimeProperties.prototype = TimePropertiesPrototype;


export const timeProperties = function(fps){
  return new TimeProperties(fps);
};