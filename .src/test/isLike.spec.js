import { isObject, likeObject, isEmpty, isPlainObject, eqof, eqeq } from '../src/functions/isLike';
describe('Functions isLike', () => {
  
  it('select', () => {
    return "TODO : get",undefined;
    
    var object = { 'a': [{ 'b': { 'c': 3 } }] };
    
    _.get(object, 'a[0].b.c');
    // => 3
    
    _.get(object, ['a', '0', 'b', 'c']);
    // => 3
    
    _.get(object, 'a.b.c', 'default');
    // => 'default'
  })
  
  // isEmpty
  it('isEmpty', () => {
    expect(isEmpty(null)).toEqual(true);
    expect(isEmpty(void 0)).toEqual(true);
    expect(isEmpty([])).toEqual(true);
    expect(isEmpty({})).toEqual(true);
    expect(isEmpty(NaN)).toEqual(true);
    expect(isEmpty("")).toEqual(true);
    expect(isEmpty("  ")).toEqual(true);
    
    expect(isEmpty(" A ")).toEqual(false);
    expect(isEmpty(true)).toEqual(false);
    expect(isEmpty(0)).toEqual(false);
    expect(isEmpty(1)).toEqual(false);
    expect(isEmpty([1])).toEqual(false);
    expect(isEmpty({'foo':'bar'})).toEqual(false);
  });
  
  it('isObject', () => {
    
    expect(isObject({})).toEqual(true);
    expect(isObject([1, 2, 3])).toEqual(true);
    expect(isObject((function(){}))).toEqual(false);
    expect(isObject(null)).toEqual(false);
    
  });
  
  it('likeObject', () => {
    
    expect(likeObject({})).toEqual(true);
    expect(likeObject([1, 2, 3])).toEqual(true);
    expect(likeObject((function(){}))).toEqual(true);
    expect(likeObject(null)).toEqual(false);
    
  });
  
  var DummyClass = function(){};
  var dummyInstance = new DummyClass();
  
  it('isPlainObject', () => {
    expect( isPlainObject({}) ).toEqual(true);
    expect( isPlainObject([]) ).toEqual(false);
    expect( isPlainObject(1) ).toEqual(false);
    expect( isPlainObject("") ).toEqual(false);
    expect( isPlainObject(new Date()) ).toEqual(false);
    expect( isPlainObject(dummyInstance) ).toEqual(false);
  });
  
  it('eqof', () => {
    expect( eqof() ).toEqual("none");
    expect( eqof(undefined) ).toEqual("none");
    expect( eqof(null) ).toEqual("none");
    expect( eqof(NaN) ).toEqual("none");
    expect( eqof(1) ).toEqual("value");
    expect( eqof(1.1) ).toEqual("value");
    expect( eqof("1") ).toEqual("value");
    expect( eqof([]) ).toEqual("array");
    expect( eqof({}) ).toEqual("hash");
    expect( eqof(true) ).toEqual("boolean");
    expect( eqof(function(){}) ).toEqual("function");
    expect( eqof(dummyInstance) ).toEqual("object");
  });
  
  it('eqeq', () => {
    expect( eqeq("1",1) ).toEqual(true);
    expect( eqeq(undefined,null) ).toEqual(true);
    expect( eqeq(NaN,null) ).toEqual(true);
    expect( eqeq(47,47) ).toEqual(true);
    expect( eqeq("47","47") ).toEqual(true);
    expect( eqeq(47,"47") ).toEqual(true);
    expect( eqeq(true,true) ).toEqual(true);
    
    //
    expect( eqeq(false,true) ).toEqual(false);
    expect( eqeq(1,2) ).toEqual(false);
    expect( eqeq("3","4") ).toEqual(false);
  });
  
});