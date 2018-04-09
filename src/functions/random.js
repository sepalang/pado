import { isAbsoluteNaN } from './isLike'

export const rand64 = (function(){
  var rand64Token = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  return function(length,codeAt,codeLength){
    length     = (isAbsoluteNaN(length)) ? 1 : parseInt(length);
    codeAt     = (isAbsoluteNaN(codeAt)) ? 0 : parseInt(codeAt);
    codeLength = (isAbsoluteNaN(codeLength)) ? 62 - codeAt : parseInt(codeLength);
    var result = "";
    for(var i=0,l=length;i<l;i++) result = result + rand64Token.charAt( codeAt + parseInt(Math.random() * codeLength) );
    return result;
  }
}())

export const tokenize = function(seed,digits){
  return Math.floor((Math.abs(Math.sin(Number((seed + "").replace(/./g,function(s,i){ return s.charCodeAt(0); }))) * 16777215)) % 16777215).toString(digits||16) 
}