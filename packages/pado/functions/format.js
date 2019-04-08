export const humanReadableBytes = (bytes)=>{
  var unit = 1024;
  if (bytes < unit) return bytes + " B";
  var exp = Math.floor(Math.log(bytes) / Math.log(unit));
  var pre = "KMGTPE".charAt(exp - 1);
  return (bytes / Math.pow(unit, exp)).toFixed(2) + ' ' + pre + 'B';
}

export const humanReadableBytesValue = (byteString)=>{
  if(typeof byteString === "number"){
    return byteString;
  }
  
  if(/^(|\.|[0-9]+\.)[0-9]+$/.test(byteString)){
    return Math.ceil(Number(byteString));
  }
  
  const parse = /((|\.|[0-9]+\.)[0-9]+)[\s]*(|K|M|G|T|P|E)B/i.exec(byteString);
  if(!parse) return null;
  
  const number = parse[1];
  const unit = parse[3];
  if(number == 0) return 0;
  if(unit === "") return Number(number);
  const unitIndex = "KMGTPE".indexOf(unit.toUpperCase());
  
  if(unitIndex >= 0){
    return Math.ceil(number * Math.pow(1024, unitIndex+1));
  }
  
  return null;
};
