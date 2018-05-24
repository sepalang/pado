import { castString, ranger } from '../../src';

const testResult = castString(`hello[world][inner][world].props`,["["],({
  content, props:{ path }, matchExp,
  castStart, castEnd, castSize, skipSize,
  enter, next
})=>{
  if(matchExp === "["){
    const stack = ranger(0);
    skipSize && path.push( content.substr(castStart, skipSize) );
    enter(["[","]"],({ matchExp, castStart, castEnd, more, exit })=>{
      if(matchExp === "[") stack.add(1);
      if(matchExp === "]") stack.add(-1);
      if(matchExp === null) return;
      if(stack.done){
        path.push( content.substring(castStart, castEnd) );
        exit();
      } else {
        more();
      }
    });
  }
  if(matchExp === null){
    path.push( content.substring(castStart, castEnd) );
  }
},{ path:[] });

const { props:{path:pathResult} } = testResult;

console.log("testResult",pathResult);