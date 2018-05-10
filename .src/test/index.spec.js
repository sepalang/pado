import { isObject, likeObject, isEmpty } from '../src/functions/isLike';
describe('Functions isLike', () => {
  
  it('select', () => {
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
  
});