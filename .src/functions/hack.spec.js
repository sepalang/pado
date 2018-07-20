import { argumentNamesBy, scopelizeBy } from './hack';


describe('Functions hack', () => {

  
  it('argumentNamesBy', ()=>{
    // normal function
    
    const zeroFn   = function(){};
    const oneFn    = function(foo){};
    const multiFn  = function(foo,bar,kim){};
    const prefixFn = function(_foo,$bar,$$ki__m){};
    
    expect( argumentNamesBy(zeroFn) ).toEqual([]);
    expect( argumentNamesBy(oneFn) ).toEqual(['foo']);
    expect( argumentNamesBy(multiFn) ).toEqual(['foo','bar','kim']);
    expect( argumentNamesBy(prefixFn) ).toEqual(['_foo','$bar','$$ki__m']);
    
    //arrow function
    
    const arrowZeroFn   = ()=>{};
    const arrowFitFn    = (a)=>{};
    const arrowSpaceFn1 = (a)   =>{};
    const arrowSpaceFn2 = (a)=>    {};
    const arrowMultiFn  = (foo,bar,kim) => {};
    const arrowPrefixFn = (_foo,$bar,$$ki__m) => {};
    
    expect( argumentNamesBy(arrowZeroFn) ).toEqual([]);
    expect( argumentNamesBy(arrowFitFn) ).toEqual(['a']);
    expect( argumentNamesBy(arrowSpaceFn1) ).toEqual(['a']);
    expect( argumentNamesBy(arrowSpaceFn2) ).toEqual(['a']);
    expect( argumentNamesBy(arrowMultiFn) ).toEqual(['foo','bar','kim']);
    expect( argumentNamesBy(arrowPrefixFn) ).toEqual(['_foo','$bar','$$ki__m']);
    
    //
    expect( argumentNamesBy({}) ).toEqual([]);
    expect( argumentNamesBy(null) ).toEqual([]);
    expect( argumentNamesBy()     ).toEqual([]);
  });
  
  
  it('scopelizeBy', () => {
    
    const fn = scopelizeBy("a + b");
    
    expect( fn({a:1,b:2}) ).toEqual(3);
    expect( fn({a:2,b:3}) ).toEqual(5);
    expect( fn({a:"foo",b:"bar"}) ).toEqual("foobar");
    
  });
  
});

