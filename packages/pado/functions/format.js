export const humanReadableBytes = (bytes)=>{
  var unit = 1024;
  if (bytes < unit) return bytes + " B";
  var exp = Math.floor(Math.log(bytes) / Math.log(unit));
  var pre = "KMGTPE".charAt(exp - 1);
  return (bytes / Math.pow(unit, exp)).toFixed(2) + ' ' + pre + 'B';
}
