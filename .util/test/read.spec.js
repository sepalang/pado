import { readPath, get, hasValue } from '../../.src/functions/read';

describe('Functions read', () => {

  it('readPath', ()=>{
    expect( readPath('hello') ).toEqual(['hello']);
    expect( readPath('hello.world') ).toEqual(['hello','world']);
    expect( readPath(`hello['world']`) ).toEqual(['hello','world']);
    expect( readPath(`hello["world"]`) ).toEqual(['hello','world']);
    expect( readPath(`a[1][2]`) ).toEqual(['a',1,2]);
    //
    expect( readPath(`hello[world]`) ).toEqual(['hello','world']);
    expect( readPath(`hello[world].my[world]`) ).toEqual(['hello','world','my','world']);
    expect( readPath(`hello[world].my[0]`) ).toEqual(['hello','world','my',0]);
  });
  
  it('get', ()=>{
    const object = { 'a': [{ 'b': { 'c': 3 } }] };

    expect( get(object, 'a[0].b.c') ).toEqual(3);
    expect( get(object, 'a[0][b][c]') ).toEqual(3);
    expect( get(object, 'a[0]["b"]["c"]') ).toEqual(3);
    expect( get(object, ['a', '0', 'b', 'c']) ).toEqual(3);
    expect( get(object, 'a.b.c', 'default') ).toEqual('default');

  });
  
  it('hasValue', ()=>{
    expect( hasValue([0,1,2],0)                                                        ).toEqual(true);
    expect( hasValue([0,1,2],3)                                                        ).toEqual(false);
    expect( hasValue({a:2,b:3},3)                                                      ).toEqual(true);
    expect( hasValue({a:2,b:3},"b")                                                    ).toEqual(false);
    expect( hasValue([{a:2,b:3},{a:5}],{a:2},"a")                                      ).toEqual(true);
    expect( hasValue([{a:2,b:3},{a:5}],{a:4},"a")                                      ).toEqual(false);
    expect( hasValue([{id:2,b:3},{id:3}],{sid:2},["id","sid"])                         ).toEqual(true);
    expect( hasValue([{id:2,b:3},{id:3}],{sid:4},["id","sid"])                         ).toEqual(false);
    expect( hasValue([{id:2},{id:3}],{id:"2"},function(a,b){ return a.id == b.id;  })  ).toEqual(true);
    expect( hasValue([{id:2},{id:3}],{id:"2"},function(a,b){ return a.id === b.id;  }) ).toEqual(false);
  });
  
});

