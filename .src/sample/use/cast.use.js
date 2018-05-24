import { castString } from '../../src';

const testResult = castString(`hello.world`,["."],({
  content, props:{ path }, matchExp,
  castStart, castEnd, matchIndex, 
  next
})=>{
  switch(matchExp){
  case ".":
    path.push( content.substring(castStart, matchIndex) )
    next();
    break;
  case null:
    path.push( content.substring(castStart, castEnd) );
    break;
  }
},{ path:[] });

const { props:{path:pathResult} } = testResult;

console.log("testResult",pathResult);