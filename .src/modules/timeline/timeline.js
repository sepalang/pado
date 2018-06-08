import { asArray } from '../../functions'
import { timescaleExp } from '../../functions/datetime'

// 시작시간등의

const Timeline = function(fps){
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

const TimelinePrototype = {
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
    }
  },
  _interval:{
    get (){
      return 1000 / this._fps;
    }
  }
}

Timeline.prototype = TimelinePrototype;


export const timeline = function(fps){
  return new Timeline(fps);
};