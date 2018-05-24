import { castPath } from '../src/functions/cast';

describe('Functions cast', () => {

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
  
});

