import { matchString, cut, top, findIndex, findIndexes } from '../src/functions/reducer';
describe('Functions reducer', () => {
  
  it('matchString', () => {
    expect( matchString("hello.world",".") ).toEqual([5,1])
    expect( matchString("hello-world.hello",".") ).toEqual([11,1])
    expect( matchString("hello.world.hello",".",6) ).toEqual([11,1])
    expect( matchString("hello..world","..") ).toEqual([5,2])
    expect( matchString("hello.world",/l./) ).toEqual([2,2])
    expect( matchString("hello.world",/l.o/) ).toEqual([2,3])
    expect( matchString("hello.world",/o.w/) ).toEqual([4,3])
    
    expect( matchString("hello.world",/l./,5) ).toEqual([9,2])
    expect( matchString("hello.world",/l.o/,5) ).toEqual([-1,0])
    
    expect( matchString("hello.world","") ).toEqual([0,0])
    expect( matchString("hello.world","z") ).toEqual([-1,0])
  });
  
  it('cut', () => {
    expect( cut([1,2,3]) ).toEqual([1]);
    expect( cut([1,2,3],2) ).toEqual([1,2]);
    expect( cut([1,2],3) ).toEqual([1,2,undefined]);
    expect( cut([1],3,1) ).toEqual([1,1,1]);
    expect( cut([0],3,i=>i) ).toEqual([0,1,2]);
    expect( cut(0,3,i=>i) ).toEqual([0,1,2]);
  });
  
  it('top', () => {
    expect( top([4,2,5]) ).toEqual(5);
    expect( top(["a","b","c"]) ).toEqual("c");
    
    //
    expect( top([4,2,5],null,1) ).toEqual([5]);
    expect( top([4,2,5],null,2) ).toEqual([5,4]);
    expect( top([4,2,5],null,10) ).toEqual([5,4,2]);
    
    //none array
    expect( top() ).toEqual();
    expect( top(null) ).toEqual();
    expect( top(false) ).toEqual(false);
    expect( top(13) ).toEqual(13);
    expect( top(13,null,1) ).toEqual([13]);
    
    //
    expect( top([1,2,3],true) ).toEqual(3);
    expect( top([1,2,3],false) ).toEqual(1);
    expect( top([1,2,3],true,true) ).toEqual([3,2,1]);
    expect( top([1,2,3],false,true) ).toEqual([1,2,3]);    
    expect( top([1,2,3],(a,b)=>a<b,true) ).toEqual([3,2,1]);
    expect( top([1,2,3],(a,b)=>a>b,true) ).toEqual([1,2,3]);
    
    //it's natural way
    expect( top([1,2,3],(a,b)=>a>b,false) ).toEqual([]);
  });
  
  // isEmpty
  it('findIndex', () => {
    expect( findIndex("hello world","l") ).toEqual(2);
    expect( findIndex("hello world",/l/) ).toEqual(2);
    expect( findIndex("hello world",/\s/) ).toEqual(5);
  });
  
  it('findIndexes', () => {
    expect( findIndexes("hello world","l") ).toEqual([2,3,9]);
    expect( findIndexes("hello world",/l/) ).toEqual([2,3,9]);
    expect( findIndexes("hello world",/\s/) ).toEqual([5]);
  });
  
});