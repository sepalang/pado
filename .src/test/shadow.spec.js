import { entries, keys, deepKeys } from '../src/functions/shadow';

describe('Functions shadow', () => {
  
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
});