import { castPath, entries, keys } from '../src/functions/cast';

describe('Functions cast', () => {
  const dummyInstance = getInstance();
  
  it('castPath', ()=>{
    expect( castPath('hello') ).toEqual(['hello']);
    expect( castPath('hello.world') ).toEqual(['hello','world']);
    expect( castPath(`hello['world']`) ).toEqual(['hello','world']);
    expect( castPath(`hello["world"]`) ).toEqual(['hello','world']);
    expect( castPath(`a[1][2]`) ).toEqual(['a',1,2]);
    
    //
    expect( castPath(`hello[world]`) ).toEqual(['hello','world']);
    expect( castPath(`hello[world].my[world]`) ).toEqual(['hello','world','my','world']);
    expect( castPath(`hello[world].my[0]`) ).toEqual(['hello','world','my',0]);
    
  });
  
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
    
  });
  
});

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
