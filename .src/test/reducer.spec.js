import { findIndex, findIndexes } from '../src/functions/reducer';
describe('Functions reducer', () => {
  
  // isEmpty
  it('findIndex', () => {
    expect(findIndex("hello world","l")).toEqual(2);
    expect(findIndex("hello world",/l/)).toEqual(2);
    expect(findIndex("hello world",/\s/)).toEqual(5);
  });
  
  it('findIndexes', () => {
    expect(findIndexes("hello world","l")).toEqual([2,3,9]);
    expect(findIndexes("hello world",/l/)).toEqual([2,3,9]);
    expect(findIndexes("hello world",/\s/)).toEqual([5]);
  });
  
});