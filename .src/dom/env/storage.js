const toDataString = function(tods){ 
	switch(typeof tods){
		case "string":
      return `"${tods}"`
		case "object":
      return JSON.stringify(tods)
    case "boolean": case "undefined": case "number":
		default:
      return `${tods}`;
	}
};

const fromDataString = function(v){ 
  return eval("(" + v + ")");
};

//로컬스토리지 데이터 저장
export const setLocalData = function(k,v){
  const localStorage = window.localStorage;
  if(typeof k === "object"){
    Object.keys(k).forEach(key=>{
      localStorage.setItem(key,toDataString(k[key]));
    });
  } else {
    localStorage.setItem(k,toDataString(v));
  }
  return true;
};

//로컬스토리지 데이터 불러오기
export const getLocalData = function(k){
  const localStorage = window.localStorage;
  if(!arguments.length) return localStorage;
  let stringData = localStorage.getItem(k);
  return (stringData==null) ? undefined : fromDataString(stringData);
};