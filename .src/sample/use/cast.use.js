import { castString } from '../../src';

const testResult = castString(`hello.world`,["."],({
  content, props:{ path }, 
  startIndex, endIndex, 
  matchType, matchIndex, 
  next
})=>{
  if(matchType === 0){
    path.push( content.substring(startIndex, matchIndex) )
    next();
  }
  
  if(matchType === -1){
    path.push( content.substring(startIndex, endIndex) )
  }
},{ path:[] });

const { props:{path:pathResult} } = testResult;

console.log("testResult",pathResult);