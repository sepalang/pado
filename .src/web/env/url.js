import { isArray, asArray } from '../../functions';

export const readUrl = function(inputUrl){
  let info;
  let url; 
    
  try {
    url  = inputUrl?inputUrl:window.document.URL.toString();
    info = /([\w]+)(\:[\/]+)([^/]*\@|)([\w\d\.\-\_\+]+)(\:[\d]+|)(\/|)([\w\d\.\/\-\_\;\=]+|)(\?[\d\w\=\&\%\,\.\/\(\)-]+|)(\#[\d\w]*|)/.exec(url);
  } catch(e) {
    info = null;
  }
  
  if(info === null) {
    console.error("faild parse url",inputUrl);
    return {
      url:url || null,
      valid:false
    };
  }
  
  const protocol = info[1];
  const divider = info[2];
  const userinfo = info[3];
  const hostname = info[4];
  const port = info[5].substring(1);
  const path = info[6]+info[7];
  const query = info[8];
  const fragment = info[9];
  const filename = /(\/|)([\w\d\.\-\_]+|)$/.exec(info[6]+info[7])[2];
  const host = info[1]+info[2]+info[4]+info[5];
  const params = (function(){
    const result = {};
    if(query){
      query.substr(1).split("&").forEach((onePiece)=>{
        const entry = onePiece.split("=");
        result[decodeURI(entry[0])] = decodeURI(entry[1]);
      });
    }
    return result;
  }());

  return {
    url,
    protocol,
    divider,
    userinfo,
    hostname,
    port,
    path,
    query,
    fragment,
    filename,
    host,
    params,
    valid:true
  };
};
    
export const serialize = function(obj,transform){
  const params = [];
  let invalid  = [];
  
  Object.keys(obj).forEach(key=>{
    let value = obj[key];
    let stringValue = "";

    if(typeof value === "undefined"){
      return;
    } else if(value === null){
      stringValue = "";
    } else if(isArray(value)){
      return value.each((val)=>{
        typeof transform === "function" ?
        params.push(transform(key) + "=" + transform(val)):
        params.push(key + "=" + val);
      });
    } else if(typeof value === "object") {
      return invalid.push(key);
    } else {
      stringValue = value + "";
    }
          
    typeof transform === "function" ?
    params.push(transform(key) + "=" + transform(stringValue)):
    params.push(key + "=" + stringValue);
  })
      
  if(invalid.length){
    invalid = null;
  }
  
  return params.join("&");
}