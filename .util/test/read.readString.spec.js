/*
//// keywords ////
firstIndex                                           lastIndex
 castStart                    castEnd                    |
    |                           |                        |
    |--- casting & castSize ----|                        |
    |     matchIndex            |                        |
    |         |                 |                        |
    |skipSize |--- matchSize ---|                        |
____helloworld[thisismatchtarget]nexttext[nextmatchtarget]____
    |         |-- fork scope ---|
    |                           |------ next scope ---->>|
    |         |---- enter   -->>|----- exit():next ---->>|
    |--------------------- more scope -->>               |

//// enter scope (internal) ////
  (castingStart)
    castStart_ _cursor                          lastIndex
              |                                         |
____helloworld[thisismatchtarget]nexttext[nextmatchtarget]____
    |---------|-----------------|
            enter

//// more scope (internal) ////
 castStart
castingStart                   cursor -->>
    |                            |
____helloworld[thisismatchtarget]nexttext[nextmatchtarget]____
re
*/
import { readString } from '../../.src/functions/read';
import { ranger } from '../../.src/modules/ranger';

describe('Functions read::readString', () => {
  it('readString matchIndex', () => {
    
    const text = `hello.world.!!.abc`;
    const { props:{ path:castPath } } = readString(text,["."],({ 
      content, props:{ path }, matchType, castStart, castEnd, matchIndex, next
    })=>{
      if(matchType === 0){
        path.push( content.substring(castStart, matchIndex) );
        next();
      }
      if(matchType === -1){
        path.push( content.substring(castStart, castEnd) );
      }
    },{ path:[] });
  
    expect( castPath ).toEqual(['hello','world','!!','abc']);
  });

  it('readString matchExp', () => {
    
    const text = `hello.world.!!.abc`;
    const { props:{ path:castPath } } = readString(text,["."],({
      content, props:{ path }, matchExp, castStart, castEnd, matchIndex, next
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
  
    expect( castPath ).toEqual(['hello','world','!!','abc']);
  });

  it('readString - matchBlock - enter, exit, more', () => {
    const text = `hello[world][inner][world].props`;
    const { props:{ path:castPath } } = readString(text,["["],({
      content, props:{ path }, matchExp, castStart, castEnd, castSize, skipSize, enter, next
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
  
    expect( castPath ).toEqual([ 'hello', '[world]', '[inner]', '[world]', '.props' ]);
  });
});
