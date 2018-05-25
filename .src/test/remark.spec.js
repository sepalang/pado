import { entries, keys, deepKeys, matchString, findIndex, findIndexes } from '../src/functions/remark';

describe('Functions remark', () => {
  
  it('entries', () => {
    expect( entries([1,2,3]) ).toEqual([[0,1],[1,2],[2,3]]);
    expect( entries({foo:"bar"}) ).toEqual([["foo","bar"]]);
    
    //
    expect( entries(null) ).toEqual([]);
    expect( entries() ).toEqual([]);
    expect( entries(1) ).toEqual([]);
    expect( entries("string") ).toEqual([]);
    expect( entries(false) ).toEqual([]);
  });
  
  it('keys', () => {
    const dummyInstance = getInstance();
    
    //
    expect( keys([1,2,3]) ).toEqual([0,1,2]);
    expect( keys({foo:"bar", kim:"chi"}) ).toEqual(["foo","kim"]);
    expect( keys(dummyInstance) ).toEqual(["name","called","now"]);
    
    //
    expect( keys([]) ).toEqual([]);
    expect( keys({}) ).toEqual([]);
    expect( keys(new Date()) ).toEqual([]);
    //
    expect( keys() ).toEqual([]);
    expect( keys(false) ).toEqual([]);
    expect( keys(null) ).toEqual([]);
    
    
    function getInstance(){
      var DummyClass = function(){
        this.name = "dummy";
        this.called = 0;
        this.now = ()=>this.called;
      };

      DummyClass.prototype = {
        plus (){
          this.called ++;
        }
      }

      var dummyInstance = new DummyClass();
      dummyInstance.plus();
      dummyInstance.plus();
      return dummyInstance;
    }
  });
  
  it('deepKeys', () => {
    expect( deepKeys({a:1,b:{d:1,e:2},c:[1,2,3]}) ).toEqual([ 
      ['a'],
      ['b'],
      ['b','d'],
      ['b','e'],
      ['c'],
      ['c',0],
      ['c',1],
      ['c',2] 
    ]);
    
    expect( deepKeys([null,{},{a:1,b:2,arr:[3,4,[5,null]]},123,{the:"end"}]) ).toEqual([ 
      [0],
      [1],
      [2],
      [2,'a'],
      [2,'b'],
      [2,'arr'],
      [2,'arr',0],
      [2,'arr',1],
      [2,'arr',2],
      [2,'arr',2,0],
      [2,'arr',2,1],
      [3],
      [4],
      [4,'the']
    ]);
  });
  
  
  it('matchString', () => {
    expect( matchString("hello.world",".") ).toEqual([5,1])
    expect( matchString("hello-world.hello",".") ).toEqual([11,1])
    expect( matchString("hello.world.hello",".",6) ).toEqual([11,1])
    expect( matchString("hello..world","..") ).toEqual([5,2])
    expect( matchString("hello.world",/l./) ).toEqual([2,2])
    expect( matchString("hello.world",/l.o/) ).toEqual([2,3])
    expect( matchString("hello.world",/o.w/) ).toEqual([4,3])
    
    expect( matchString("abcd","c") ).toEqual([2,1]);
    expect( matchString("abcd","c",2) ).toEqual([2,1]);
    
    expect( matchString("hello.world",/l./,5) ).toEqual([9,2])
    expect( matchString("hello.world",/l.o/,5) ).toEqual([-1,0])
    
    expect( matchString("hello.world","") ).toEqual([0,0])
    expect( matchString("hello.world","z") ).toEqual([-1,0])
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